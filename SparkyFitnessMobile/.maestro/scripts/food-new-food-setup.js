// Picks a unique name for the food flows-data/food/new-food.yaml types into
// the New Food form, and checks before anything is created that this key can
// search the account's own foods and delete them: the app (not this script)
// creates the food, and scripts/food-new-food-cleanup.js finds it by that name
// through the same search and deletes it. Runs on the computer that runs
// `maestro` (GraalJS).
//
// Env: SERVER_URL or HOST_SERVER_URL, API_KEY (full access: the cleanup
// deletes). Never print the key.
// Output: output.newFoodName ("Maestro New Food <ms>", every word capitalised
// so the name field's autoCapitalize="words" cannot change it),
// output.newFoodSearchTerm (<ms>).

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
    'food-new-food-setup: pass -e SERVER_URL=<server as this computer reaches it>'
  );
}
if (!present(apiKey)) {
  throw new Error(
    'food-new-food-setup: pass -e API_KEY=<full-access key of the test account>'
  );
}

var BASE = String(hostUrl).replace(/\/+$/, '');
var searchTerm = String(Date.now());
var foodName = 'Maestro New Food ' + searchTerm;

// GET /api/foods/foods-paginated (SparkyFitnessServer/routes/foodCrudRoutes.ts)
// answers 200 { foods, totalCount }. foodFilter=mine keeps the key's own
// foods; quick (hidden) foods are never listed (models/food.ts
// getFoodsWithPagination), and the form saves with is_quick_food false in
// library mode (src/screens/foodForm/CreateFoodMode.tsx).
var res = http.get(
  BASE +
    '/api/foods/foods-paginated?searchTerm=' +
    encodeURIComponent(searchTerm) +
    '&foodFilter=mine&currentPage=1&itemsPerPage=20&sortBy=name%3Aasc',
  { headers: { Authorization: 'Bearer ' + apiKey } }
);
if (res.status !== 200) {
  throw new Error(
    'food-new-food-setup: GET /api/foods/foods-paginated -> HTTP ' +
      res.status +
      ' ' +
      String(res.body || '').slice(0, 300)
  );
}
var page = json(res.body);
if (!page || !Array.isArray(page.foods)) {
  throw new Error(
    'food-new-food-setup: GET /api/foods/foods-paginated returned no foods list'
  );
}

// A read-only key can search but not delete, which would leave the food the
// app is about to create behind. Ask to delete a food id that cannot exist:
// a full-access key gets 404 "Food not found." (services/foodCoreService.ts
// deleteFood, mapped in routes/foodCrudRoutes.ts) and nothing changes; a
// read-only key is refused with 403 before the route runs
// (middleware/authMiddleware.ts, utils/apiKeyScope.ts).
var probe = http.delete(
  BASE + '/api/foods/00000000-0000-4000-8000-000000000000?mode=delete',
  { headers: { Authorization: 'Bearer ' + apiKey } }
);
if (probe.status === 403) {
  throw new Error(
    'food-new-food-setup: this API key is read-only; the cleanup needs a full-access key'
  );
}
if (probe.status !== 404) {
  throw new Error(
    'food-new-food-setup: delete check -> HTTP ' +
      probe.status +
      ' (expected 404 for a food that does not exist) ' +
      String(probe.body || '').slice(0, 300)
  );
}

output.newFoodName = foodName;
output.newFoodSearchTerm = searchTerm;
console.log('food-new-food-setup: the form will create "' + foodName + '"');
