// Creates one uniquely named custom food and logs it for today through the
// API, so the Diary has a meal section that the flow itself created. Runs on
// the computer that runs `maestro` (GraalJS), not on the phone. "Today" is the
// computer's local date: it must be the phone's date too.
//
// Env: SERVER_URL or HOST_SERVER_URL, API_KEY (full access; read-only keys are
// refused on writes). Never print the key.
// Output: output.foodId and output.foodName, which scripts/cleanup-food.js
// reads to delete the food together with this diary entry
// (mode=delete_with_history); output.entryDate.

function present(v) {
  return v !== undefined && v !== null && String(v).length > 0;
}

function pad2(n) {
  return (n < 10 ? '0' : '') + n;
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
    'diary-seed-entry: pass -e SERVER_URL=<server as this computer reaches it>'
  );
}
if (!present(apiKey)) {
  throw new Error(
    'diary-seed-entry: pass -e API_KEY=<full-access key of the test account>'
  );
}

var BASE = String(hostUrl).replace(/\/+$/, '');
var HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + apiKey,
};
var stamp = String(Date.now());
var foodName = 'Maestro Diary ' + stamp;

// POST /api/foods (SparkyFitnessServer/routes/foodCrudRoutes.ts) answers 201
// with the new food and its default_variant (models/food.ts,
// createFoodWithClient). Same body as scripts/seed-food.js: a library food,
// so a leftover can be found and deleted by hand in Library > Foods.
var foodRes = http.post(BASE + '/api/foods', {
  headers: HEADERS,
  body: JSON.stringify({
    name: foodName,
    brand: null,
    serving_size: 100,
    serving_unit: 'g',
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    is_custom: true,
    is_quick_food: false,
    is_default: true,
    barcode: null,
  }),
});
if (foodRes.status !== 201) {
  throw new Error(
    'diary-seed-entry: POST /api/foods -> HTTP ' +
      foodRes.status +
      ' ' +
      String(foodRes.body || '').slice(0, 300)
  );
}
var food = json(foodRes.body);
if (!present(food.id)) {
  throw new Error('diary-seed-entry: POST /api/foods returned no id');
}
// The food exists from here on: hand it to cleanup-food.js before anything
// else can fail.
output.foodId = String(food.id);
output.foodName = foodName;

var variantId = food.default_variant ? food.default_variant.id : null;
if (!present(variantId)) {
  throw new Error(
    'diary-seed-entry: POST /api/foods returned no default_variant.id'
  );
}

var now = new Date();
var today =
  now.getFullYear() +
  '-' +
  pad2(now.getMonth() + 1) +
  '-' +
  pad2(now.getDate());

// POST /api/food-entries (SparkyFitnessServer/routes/foodEntryRoutes.ts)
// answers 201 with the entry. models/foodEntry.ts createFoodEntry resolves
// meal_type by name when no meal_type_id is sent; "breakfast" is a system meal
// type (db/migrations/20260111180656_custom_meal_feature.sql).
var entryRes = http.post(BASE + '/api/food-entries', {
  headers: HEADERS,
  body: JSON.stringify({
    food_id: output.foodId,
    variant_id: String(variantId),
    meal_type: 'breakfast',
    quantity: 100,
    unit: 'g',
    entry_date: today,
    entry_time: null,
  }),
});
if (entryRes.status !== 201) {
  throw new Error(
    'diary-seed-entry: POST /api/food-entries -> HTTP ' +
      entryRes.status +
      ' ' +
      String(entryRes.body || '').slice(0, 300)
  );
}

output.entryDate = today;
console.log('diary-seed-entry: logged "' + foodName + '" for ' + today);
