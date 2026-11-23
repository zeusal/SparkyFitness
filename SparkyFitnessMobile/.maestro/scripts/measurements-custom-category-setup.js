// Picks a unique name for the custom measurement category that
// flows-data/measurements/custom-category.yaml types into the Add category
// form, and checks before anything is created that this key can list the
// account's categories and delete them: the app (not this script) creates the
// category, and scripts/measurements-custom-category-cleanup.js finds it by
// that name through the same list and deletes it. Runs on the computer that
// runs `maestro` (GraalJS).
//
// Env: SERVER_URL or HOST_SERVER_URL, API_KEY (full access: the cleanup
// deletes). Never print the key.
// Output: output.categoryName ("Maestro Category <ms>").

function present(v) {
  return v !== undefined && v !== null && String(v).length > 0;
}

var hostUrl =
  typeof HOST_SERVER_URL !== 'undefined' && present(HOST_SERVER_URL)
    ? HOST_SERVER_URL
    : typeof SERVER_URL !== 'undefined'
      ? SERVER_URL
      : '';
var apiKey =
  typeof API_KEY !== 'undefined' && present(API_KEY) ? String(API_KEY) : '';

if (!present(hostUrl)) {
  throw new Error(
    'measurements-custom-category-setup: pass -e SERVER_URL=<server as this computer reaches it>'
  );
}
if (!present(apiKey)) {
  throw new Error(
    'measurements-custom-category-setup: pass -e API_KEY=<full-access key of the test account>'
  );
}

var BASE = String(hostUrl).replace(/\/+$/, '');
var AUTH = { Authorization: 'Bearer ' + apiKey };
var categoryName = 'Maestro Category ' + String(Date.now());

// GET /api/measurements/custom-categories
// (SparkyFitnessServer/routes/measurementRoutes.ts) answers 200 with the
// account's categories: [{ id, name, display_name, frequency,
// measurement_type, data_type }] (models/measurementRepository.ts
// getCustomCategories).
var res = http.get(BASE + '/api/measurements/custom-categories', {
  headers: AUTH,
});
if (res.status !== 200) {
  throw new Error(
    'measurements-custom-category-setup: GET /api/measurements/custom-categories -> HTTP ' +
      res.status +
      ' ' +
      String(res.body || '').slice(0, 300)
  );
}
var categories = json(res.body);
if (!Array.isArray(categories)) {
  throw new Error(
    'measurements-custom-category-setup: GET /api/measurements/custom-categories returned no list'
  );
}

// A read-only key can list but not delete, which would leave the category the
// app is about to create behind. Ask to delete a category id that cannot
// exist: a full-access key gets 404 "Custom category not found."
// (services/measurementService.ts deleteCustomCategory, mapped in
// routes/measurementRoutes.ts) and nothing changes; a read-only key is refused
// with 403 before the route runs (middleware/authMiddleware.ts,
// utils/apiKeyScope.ts).
var probe = http.delete(
  BASE +
    '/api/measurements/custom-categories/00000000-0000-4000-8000-000000000000',
  { headers: AUTH }
);
if (probe.status === 403) {
  throw new Error(
    'measurements-custom-category-setup: this API key is read-only; the cleanup needs a full-access key'
  );
}
if (probe.status !== 404) {
  throw new Error(
    'measurements-custom-category-setup: delete check -> HTTP ' +
      probe.status +
      ' (expected 404 for a category that does not exist) ' +
      String(probe.body || '').slice(0, 300)
  );
}

output.categoryName = categoryName;
console.log(
  'measurements-custom-category-setup: the form will create "' +
    categoryName +
    '"'
);
