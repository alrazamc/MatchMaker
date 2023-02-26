import exif from 'exif-js';

export const readFile = file => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

export const createImage = data => {
  return new Promise(resolve => {
    const img = document.createElement('img');
    img.onload = () => resolve(img);
    img.src = data;
  })
}

export const dataURItoBlob = (dataURI, type) => {
  const binary = atob(dataURI.split(',')[1]);
  const array = [];
  for(let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type});
}

export const rotate = (type, img) => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    exif.getData(img, function () {
      var orientation = exif.getAllTags(this).Orientation;
      if ([5, 6, 7, 8].indexOf(orientation) > -1) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      const ctx = canvas.getContext("2d");

      switch (orientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, img.width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, img.width, img.height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, img.height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, img.height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, img.height, img.width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, img.width);
          break;
        default:
          ctx.transform(1, 0, 0, 1, 0, 0);
      }

      ctx.drawImage(img, 0, 0, img.width, img.height);
      let dataUrl = canvas.toDataURL(type);
      let blobData = dataURItoBlob(dataUrl, type);
      resolve(blobData);
    });
  })
}