// Deletes the food flows-data/food/new-food.yaml created through the New Food
// form. The app made it, so its id is looked up by the run's unique name.
// Runs from onFlowComplete, so it also cleans up after a failed step, but not
// after Ctrl+C or a killed run. Never print the key.
//
// GET /api/foods/foods-paginated?searchTerm=<ms>&foodFilter=mine
//   -> 200 { foods: [{ id, name, ... }] } (the account's own library foods)
// DELETE /api/foods/:id?mode=delete_with_history
//   -> 200 { status: 'deleted_with_history' }; 'hidden' when another account
//   uses the food (SparkyFitnessServer/routes/foodCrudRoutes.ts,
//   services/foodCoreService.ts deleteFood).
// Only foods whose name holds this run's number and starts with
// "Maestro New Food" are touched.

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
var byHand =
  ' Delete it by hand: Library > Foods > the food > Delete Food > Delete including history.';

if (!present(output.newFoodSearchTerm)) {
  console.log(
    'food-new-food-cleanup: the setup did not run, nothing to delete'
  );
} else if (!present(hostUrl) || !present(apiKey)) {
  // The setup refuses to run without both, so the form was never filled in.
  console.log(
    'food-new-food-cleanup: missing SERVER_URL or API_KEY, nothing was created'
  );
} else {
  var BASE = String(hostUrl).replace(/\/+$/, '');
  var AUTH = { Authorization: 'Bearer ' + apiKey };
  var name = String(output.newFoodName);
  var term = String(output.newFoodSearchTerm);

  var res = http.get(
    BASE +
      '/api/foods/foods-paginated?searchTerm=' +
      encodeURIComponent(term) +
      '&foodFilter=mine&currentPage=1&itemsPerPage=20&sortBy=name%3Aasc',
    { headers: AUTH }
  );
  if (res.status !== 200) {
    throw new Error(
      'food-new-food-cleanup: could not search for "' +
        name +
        '" (HTTP ' +
        res.status +
        ').' +
        byHand
    );
  }
  var page = json(res.body);
  var foods = page && Array.isArray(page.foods) ? page.foods : [];
  var ours = foods.filter(function (f) {
    return (
      f &&
      present(f.id) &&
      typeof f.name === 'string' &&
      f.name.indexOf(term) !== -1 &&
      /^maestro new food /i.test(f.name)
    );
  });

  if (ours.length === 0) {
    if (output.newFoodSaveTapped) {
      throw new Error(
        'food-new-food-cleanup: Save was tapped but no "' +
          name +
          '" was found. If the app said "Failed to save food", nothing was created;' +
          ' otherwise look for it in Library > Foods and delete it (Delete Food >' +
          ' Delete including history).'
      );
    }
    console.log(
      'food-new-food-cleanup: Save was never tapped, nothing to delete'
    );
  } else {
    var failed = [];
    for (var i = 0; i < ours.length; i++) {
      var del = http.delete(
        BASE +
          '/api/foods/' +
          encodeURIComponent(String(ours[i].id)) +
          '?mode=delete_with_history',
        { headers: AUTH }
      );
      var status = '';
      if (del.ok) {
        try {
          status = String(json(del.body).status || '');
        } catch (e) {
          status = '';
        }
      }
      if (status !== 'deleted_with_history') {
        failed.push(
          '"' + ours[i].name + '" (HTTP ' + del.status + ', "' + status + '")'
        );
      }
    }
    if (failed.length > 0) {
      throw new Error(
        'food-new-food-cleanup: not deleted: ' +
          failed.join(', ') +
          '.' +
          byHand
      );
    }
    console.log(
      'food-new-food-cleanup: deleted "' +
        name +
        '"' +
        (ours.length > 1 ? ' (' + ours.length + ' copies)' : '')
    );
  }
}
