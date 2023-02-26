export const profileRoutes = [
  { label: "Dashboard", path: '/my/dashboard'},
  { label: "My Profile", path: '/my/profile'},
  { label: "My Photos", path: '/my/photos'},
  { label: "Partner Preferences", path: '/my/partner-preference'},
  { label: "Settings", path: '/my/account-settings'}
];

export const matchesRoutes = [
  { label: "Suggestions", path: '/matches/suggestions'},
  { label: "Shortlisted", path: '/matches/shortlisted'},
];

export const searchRoutes = [
  { label: "Basic Search", path: '/search/basic?editBasic=true'},
  { label: "Advanced Search", path: '/search/advanced?editAdvanced=true'},
];

export const inboxRoutes = [
  { label: "Sent Requests", path: '/inbox/sent/pending'},
  { label: "Received Requests", path: '/inbox/received/pending'},
  { label: "Connections", path: '/inbox/connections'},
];