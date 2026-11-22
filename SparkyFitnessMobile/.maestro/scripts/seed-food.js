// Creates one uniquely named custom food through the API, so flows never
// depend on online providers or on earlier runs. Runs on the computer that
// runs `maestro` (GraalJS), not on the phone.
//
// Env: SERVER_URL or HOST_SERVER_URL, API_KEY (full access; read-only keys are
// refused on writes). Never print the key.
// Output: output.foodName, output.foodSearchTerm, output.foodId.

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
    'seed-food: pass -e SERVER_URL=<server as this computer reaches it>'
  );
}
if (!present(apiKey)) {
  throw new Error(
    'seed-food: pass -e API_KEY=<full-access key of the test account>'
  );
}

var BASE = String(hostUrl).replace(/\/+$/, '');
var searchTerm = String(Date.now());
var foodName = 'Maestro Oats ' + searchTerm;

// POST /api/foods (SparkyFitnessServer/routes/foodCrudRoutes.ts) answers 201
// with the new food. The body mirrors what the app sends for a new custom
// food (src/services/api/foodsApi.ts, SaveFoodPayload).
var res = http.post(BASE + '/api/foods', {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + apiKey,
  },
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
    is_quick_food: false, // saved to the library, so search finds it
    is_default: true,
    barcode: null,
  }),
});

if (res.status !== 201) {
  throw new Error(
    'seed-food: POST /api/foods -> HTTP ' +
      res.status +
      ' ' +
      String(res.body || '').slice(0, 300)
  );
}

var food = json(res.body);
if (!present(food.id)) {
  throw new Error('seed-food: POST /api/foods returned no id');
}

output.foodName = foodName;
output.foodSearchTerm = searchTerm;
output.foodId = String(food.id);
console.log('seed-food: created "' + foodName + '"');
