// Deletes what flows-data/water/quick-add-drink.yaml made: every drink logged
// with the preset scripts/water-seed-quick-add.js created (normally none is
// left, the flow deletes its drink in the app), then the preset itself.
// Only drinks whose container_id is that preset's id are touched. Runs from
// onFlowComplete, so it also cleans up after a failed step, but not after
// Ctrl+C or a killed run. Never print the key.
//
// GET    /api/v2/measurements/water-intake/<YYYY-MM-DD>/log
//   -> 200 [{ id, container_id, container_name, ... }] (one row per drink,
//   SparkyFitnessServer/routes/v2/waterIntakeRoutes.ts:577-601,
//   models/measurementRepository.ts:2166-2189)
// DELETE /api/v2/measurements/water-intake/log/<id>
//   -> 200, 404 when it is not there (waterIntakeRoutes.ts:631-661; it also
//   takes a linked food entry with it, services/measurementService.ts:2182-2222)
// DELETE /api/water-containers/<id>
//   -> 200 once deleted, 404 when not found (routes/waterContainerRoutes.ts:250-265,
//   services/waterContainerService.ts:164-188)
// Drinks go first: deleting the preset would only clear their container_id
// (water_intake_entries.container_id is ON DELETE SET NULL,
// db/migrations/20260509120000_add_water_intake_entries.sql:7), and they
// could no longer be told apart.
//
// The drink is logged on the phone's day; this looks at the computer's
// yesterday, today and tomorrow, so a time-zone gap between the two does not
// hide it.

function present(v) {
  return v !== undefined && v !== null && String(v).length > 0;
}

function pad2(n) {
  return (n < 10 ? '0' : '') + n;
}

function dayString(offsetDays) {
  var d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return (
    d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
  );
}

var hostUrl =
  typeof HOST_SERVER_URL !== 'undefined' && present(HOST_SERVER_URL)
    ? HOST_SERVER_URL
    : typeof SERVER_URL !== 'undefined'
      ? SERVER_URL
      : '';
var apiKey =
  typeof API_KEY !== 'undefined' && present(API_KEY) ? String(API_KEY) : '';
var byHand =
  " Delete it by hand: Dashboard > Hydration > History (the drink's delete button), then" +
  ' Library > Water containers > Delete "' +
  output.waterContainerName +
  '".';

if (!present(output.waterContainerId)) {
  console.log(
    'water-cleanup-quick-add: no test preset was created, nothing to delete'
  );
} else if (!present(hostUrl) || !present(apiKey)) {
  throw new Error(
    'water-cleanup-quick-add: missing SERVER_URL or API_KEY, "' +
      output.waterContainerName +
      '" left in place.' +
      byHand
  );
} else {
  var BASE = String(hostUrl).replace(/\/+$/, '');
  var AUTH = { Authorization: 'Bearer ' + apiKey };
  var containerId = String(output.waterContainerId);
  var days = [dayString(-1), dayString(0), dayString(1)];
  var deletedDrinks = 0;

  for (var i = 0; i < days.length; i++) {
    var logRes = http.get(
      BASE +
        '/api/v2/measurements/water-intake/' +
        encodeURIComponent(days[i]) +
        '/log',
      { headers: AUTH }
    );
    if (logRes.status !== 200) {
      throw new Error(
        'water-cleanup-quick-add: could not read the drinks of ' +
          days[i] +
          ' (HTTP ' +
          logRes.status +
          '), "' +
          output.waterContainerName +
          '" left in place.' +
          byHand
      );
    }
    var entries = json(logRes.body);
    if (!Array.isArray(entries)) entries = [];
    for (var j = 0; j < entries.length; j++) {
      var entry = entries[j];
      if (
        !entry ||
        !present(entry.id) ||
        String(entry.container_id) !== containerId
      ) {
        continue;
      }
      var delRes = http.delete(
        BASE +
          '/api/v2/measurements/water-intake/log/' +
          encodeURIComponent(String(entry.id)),
        { headers: AUTH }
      );
      if (delRes.status !== 200 && delRes.status !== 404) {
        throw new Error(
          'water-cleanup-quick-add: a drink of "' +
            output.waterContainerName +
            '" on ' +
            days[i] +
            ' was not deleted (HTTP ' +
            delRes.status +
            ').' +
            byHand
        );
      }
      deletedDrinks++;
    }
  }

  var res = http.delete(
    BASE + '/api/water-containers/' + encodeURIComponent(containerId),
    { headers: AUTH }
  );
  if (res.status !== 200) {
    throw new Error(
      'water-cleanup-quick-add: "' +
        output.waterContainerName +
        '" was not deleted (HTTP ' +
        res.status +
        ').' +
        byHand
    );
  }
  console.log(
    'water-cleanup-quick-add: deleted "' +
      output.waterContainerName +
      '"' +
      (deletedDrinks > 0
        ? ' and ' + deletedDrinks + ' drink(s) logged with it'
        : '')
  );
}
