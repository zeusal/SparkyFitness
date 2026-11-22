// Stops a clean-install flow before `clearState` can wipe an app that holds
// real data: the store/preview package and the everyday development package.
// A test build has its own id, e.g. org.SparkyApps.SparkyFitnessMobile1.e2e
// (EXPO_DEV_BUNDLE_IDENTIFIER, see app.identifiers.js).

var PROTECTED = [
  'com.SparkyApps.SparkyFitnessMobile',
  'org.SparkyApps.SparkyFitnessMobile1.dev',
];

var appId = typeof APP_ID !== 'undefined' ? String(APP_ID) : '';

if (appId === '') {
  throw new Error('guard-test-app: pass -e APP_ID=<test build package>');
}
if (PROTECTED.indexOf(appId) !== -1) {
  throw new Error(
    'guard-test-app: refusing to clear ' +
      appId +
      '. Build a separate test app (README "Clean-install flows").'
  );
}
