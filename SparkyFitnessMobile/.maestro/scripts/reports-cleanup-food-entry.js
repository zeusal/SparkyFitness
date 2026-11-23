// Deletes the diary entry reports-seed-food-entry.js created, and nothing
// else, so repeated runs do not fill the test account. Runs from
// onFlowComplete, so it also cleans up after a failed step, but not after
// Ctrl+C or a killed run. Never print the key.
//
// DELETE /api/food-entries/:id (SparkyFitnessServer/routes/foodEntryRoutes.ts)
// answers 200 once the entry is gone, 404 when there is no such entry of this
// account.

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

if (!present(output.entryId)) {
  console.log(
    'reports-cleanup-food-entry: no test entry was created, nothing to delete'
  );
} else if (!present(hostUrl) || !present(apiKey)) {
  throw new Error(
    'reports-cleanup-food-entry: missing SERVER_URL or API_KEY, "' +
      output.entryName +
      '" left in place. Delete it by hand: Diary > today > the entry > Delete.'
  );
} else {
  var BASE = String(hostUrl).replace(/\/+$/, '');
  var res = http.delete(
    BASE + '/api/food-entries/' + encodeURIComponent(output.entryId),
    { headers: { Authorization: 'Bearer ' + apiKey } }
  );
  if (res.status !== 200) {
    throw new Error(
      'reports-cleanup-food-entry: "' +
        output.entryName +
        '" was not deleted (HTTP ' +
        res.status +
        '). Delete it by hand: Diary > today > the entry > Delete.'
    );
  }
  console.log('reports-cleanup-food-entry: deleted "' + output.entryName + '"');
}
