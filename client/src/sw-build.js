const workboxBuild = require("workbox-build");
require('dotenv').config();
const buildSW = () => {
  // The build is expected to fail if the 
  // sw install rules couldn't be generated.
  // Add a catch block for this to skip
  return workboxBuild.injectManifest({
    swSrc: "src/sw-custom.js", // custom sw rules
    swDest: "build/service-worker.js", // sw output file (auto-generated)
    globDirectory: "build",
    globPatterns: ["**/*.{js,css,html,png,svg,jpg}"],
    globIgnores: ['service-worker.js', 'precache-manifest.*.js', 'firebase-messaging-sw.js'],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    manifestTransforms: [
      // Basic transformation to remove a certain URL:
      (originalManifest) => {
        let manifest = [];
        if(process.env.PUBLIC_URL)
          manifest = originalManifest.map(entry => {
            return entry.url === 'index.html' ? entry :
            {
              ...entry,
              url: process.env.PUBLIC_URL + entry.url
            }
          });
        else
          manifest = [...originalManifest];
        console.log(manifest);
        // Optionally, set warning messages.
        const warnings = []; 
        return {manifest, warnings};
      }
    ]
  })
  .then(({ count, size, warnings }) => {
    warnings.forEach(console.warn);
    console.info(`${count} files will be precached, 
                  totaling ${size/(1024 * 1024)} MBs.`);
  });
};
buildSW();