// Creates one uniquely named quick-add drink preset ("Maestro Cup <ms>":
// 250 ml of plain water, not linked to a food) through the API, so the
// Dashboard's Hydration card shows a drink only this run created. A preset
// is not the container the - and + buttons press, and it can never be the
// primary container, so nothing the person uses changes. Runs on the
// computer that runs `maestro` (GraalJS), not on the phone.
//
// Env: SERVER_URL or HOST_SERVER_URL, API_KEY (full access; the flow's
// cleanup deletes). Never print the key.
// Output: output.waterContainerId, output.waterContainerName, which
// scripts/water-cleanup-quick-add.js reads to delete every drink logged with
// this preset and then the preset itself.

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
    'water-seed-quick-add: pass -e SERVER_URL=<server as this computer reaches it>'
  );
}
if (!present(apiKey)) {
  throw new Error(
    'water-seed-quick-add: pass -e API_KEY=<full-access key of the test account>'
  );
}

var BASE = String(hostUrl).replace(/\/+$/, '');
var containerName = 'Maestro Cup ' + String(Date.now());

// POST /api/water-containers (SparkyFitnessServer/routes/waterContainerRoutes.ts:133-145)
// answers 201 with the new row, id included (models/waterContainerRepository.ts:45-105,
// INSERT ... RETURNING *). The body follows CreateWaterContainerBodySchema
// (schemas/waterContainerSchemas.ts:61-76): an unlinked container needs a
// volume above 0; is_quick_add makes it a one-tap drink on the Hydration card
// (src/hooks/useWaterIntakeMutation.ts:118-121); a quick-add preset cannot
// be primary (waterContainerRepository.ts:64-68). One press then logs
// volume / servings_per_container = 250 ml (services/measurementService.ts:690-701).
var res = http.post(BASE + '/api/water-containers', {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + apiKey,
  },
  body: JSON.stringify({
    name: containerName,
    volume: 250,
    unit: 'ml',
    is_primary: false,
    servings_per_container: 1,
    hydration_factor: 1,
    is_quick_add: true,
  }),
});

if (res.status !== 201) {
  throw new Error(
    'water-seed-quick-add: POST /api/water-containers -> HTTP ' +
      res.status +
      ' ' +
      String(res.body || '').slice(0, 300)
  );
}

var container = json(res.body);
if (!present(container.id)) {
  throw new Error(
    'water-seed-quick-add: POST /api/water-containers returned no id. Delete "' +
      containerName +
      '" by hand: Library > Water containers > its delete button.'
  );
}

output.waterContainerId = String(container.id);
output.waterContainerName = containerName;
console.log('water-seed-quick-add: created "' + containerName + '"');
