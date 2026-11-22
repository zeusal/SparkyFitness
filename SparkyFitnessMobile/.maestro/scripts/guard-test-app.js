// Stops a clean-install flow before `clearState` can wipe an app that holds
// real data. Only a build made for tests may be cleared: its id must end in
// ".e2e" (EXPO_DEV_BUNDLE_IDENTIFIER, see app.identifiers.js and the README).

var PROTECTED = [
  'com.SparkyApps.SparkyFitnessMobile',
  'org.SparkyApps.SparkyFitnessMobile1.dev',
];

var appId = typeof APP_ID !== 'undefined' ? String(APP_ID) : '';

if (appId === '') {
  throw new Error('guard-test-app: pass -e APP_ID=<test build package>');
}
if (PROTECTED.indexOf(appId) !== -1 || !/\.e2e$/.test(appId)) {
  throw new Error(
    'guard-test-app: refusing to clear ' +
      appId +
      '. Only a test build whose id ends in ".e2e" may be cleared (README "Clean-install flows").'
  );
}
