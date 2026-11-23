// Logs one uniquely named, high-protein diary entry for today through the API,
// so the Protein trend's Top Sources has a food only this run created. The
// entry is standalone (no library food): it is one row, and deleting it
// removes everything this script made. Runs on the computer that runs
// `maestro` (GraalJS), not on the phone.
//
// Env: SERVER_URL or HOST_SERVER_URL, API_KEY (full access; read-only keys are
// refused on writes). Never print the key.
// Output: output.entryId, output.entryName.

function present(v) {
  return v !== undefined && v !== null && String(v).length > 0;
}

function pad(n) {
  return n < 10 ? '0' + n : String(n);
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
    'reports-seed-food-entry: pass -e SERVER_URL=<server as this computer reaches it>'
  );
}
if (!present(apiKey)) {
  throw new Error(
    'reports-seed-food-entry: pass -e API_KEY=<full-access key of the test account>'
  );
}

var BASE = String(hostUrl).replace(/\/+$/, '');
var headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + apiKey,
};

// GET /api/meal-types (SparkyFitnessServer/routes/mealTypeRoutes.ts, 200 with
// the system and own meal types, sort_order first). food_entries.meal_type_id
// is NOT NULL, so the entry takes the first visible one.
var typesRes = http.get(BASE + '/api/meal-types', { headers: headers });
if (typesRes.status !== 200) {
  throw new Error(
    'reports-seed-food-entry: GET /api/meal-types -> HTTP ' +
      typesRes.status +
      ' ' +
      String(typesRes.body || '').slice(0, 300)
  );
}
var mealTypes = json(typesRes.body);
var mealTypeId = '';
for (var i = 0; i < mealTypes.length; i++) {
  if (mealTypes[i].is_visible !== false && present(mealTypes[i].id)) {
    mealTypeId = String(mealTypes[i].id);
    break;
  }
}
if (!present(mealTypeId)) {
  throw new Error('reports-seed-food-entry: the account has no meal type');
}

// Today on this computer, as a calendar day (the phone is assumed to be in
// the same time zone; the Protein trend looks at the last 7 days anyway).
var now = new Date();
var today =
  now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
var entryName = 'Maestro Protein ' + String(Date.now());

// POST /api/food-entries (SparkyFitnessServer/routes/foodEntryRoutes.ts)
// answers 201 with the new row. Without food_id the server stores the
// nutrition given here as the entry's snapshot (models/foodEntry.ts,
// createFoodEntry). The body mirrors the app's standalone entry
// (src/services/api/foodEntriesApi.ts, CreateFoodEntryPayload). The values
// are kept small, because while the entry exists a sync with nutrition
// write-back copies it to the phone's health store (README "Data flows").
// Calories must be above 0: the Nutrition report counts a day as logged only
// then (src/utils/nutritionReport.ts loggedPoints), and only a logged window
// shows its "Trend by nutrient" card; 1 kcal is enough. Top Sources lists the
// 3 foods with the most protein in the window (src/utils/nutrientSources.ts
// buildTopSources, each food summed over the window), so 300 g keeps the entry
// among them unless three other foods reach 300 g of protein in the last 7
// days. It stays a test-account entry: see the flow's header.
var res = http.post(BASE + '/api/food-entries', {
  headers: headers,
  body: JSON.stringify({
    meal_type_id: mealTypeId,
    quantity: 100,
    unit: 'g',
    entry_date: today,
    food_name: entryName,
    serving_size: 100,
    serving_unit: 'g',
    calories: 1,
    protein: 300,
    carbs: 0,
    fat: 0,
  }),
});

if (res.status !== 201) {
  throw new Error(
    'reports-seed-food-entry: POST /api/food-entries -> HTTP ' +
      res.status +
      ' ' +
      String(res.body || '').slice(0, 300)
  );
}

var entry = json(res.body);
if (!present(entry.id)) {
  throw new Error(
    'reports-seed-food-entry: POST /api/food-entries returned no id. Delete "' +
      entryName +
      '" by hand: Diary > today > the entry > Delete.'
  );
}

output.entryId = String(entry.id);
output.entryName = entryName;
console.log('reports-seed-food-entry: logged "' + entryName + '" for ' + today);
