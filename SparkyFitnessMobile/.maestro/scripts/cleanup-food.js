// Deletes the food seed-food.js created, with every diary entry that uses it,
// so repeated runs do not fill the test account. Runs from onFlowComplete, so
// it also cleans up after a failed step, but not after Ctrl+C or a killed run.
// Never print the key.
//
// DELETE /api/foods/:id?mode=delete_with_history
// (SparkyFitnessServer/routes/foodCrudRoutes.ts: hide | delete |
// delete_with_history; only the last one also removes diary entries).

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

if (!present(output.foodId)) {
  console.log('cleanup-food: no test food was created, nothing to delete');
} else if (!present(hostUrl) || !present(apiKey)) {
  console.log(
    'cleanup-food: missing SERVER_URL or API_KEY, "' +
      output.foodName +
      '" left in place'
  );
} else {
  var BASE = String(hostUrl).replace(/\/+$/, '');
  var res = http.delete(
    BASE +
      '/api/foods/' +
      encodeURIComponent(output.foodId) +
      '?mode=delete_with_history',
    { headers: { Authorization: 'Bearer ' + apiKey } }
  );
  var status = '';
  if (res.ok) {
    try {
      status = String(json(res.body).status || '');
    } catch (e) {
      status = '';
    }
  }
  // The server hides instead of deleting when another account uses the food.
  if (status !== 'deleted_with_history') {
    throw new Error(
      'cleanup-food: "' +
        output.foodName +
        '" was not deleted (HTTP ' +
        res.status +
        ', status "' +
        status +
        '"). Delete it by hand: Library > Foods > the food > Delete > Delete including history.'
    );
  }
  console.log('cleanup-food: deleted "' + output.foodName + '"');
}
