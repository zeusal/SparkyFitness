// Deletes the custom measurement category that
// flows-data/measurements/custom-category.yaml created through the Add
// category form. The app made it, so its id is looked up by the run's unique
// name. Runs from onFlowComplete, so it also cleans up after a failed step,
// but not after Ctrl+C or a killed run. Never print the key.
//
// GET /api/measurements/custom-categories
//   -> 200 [{ id, name, ... }] (the account's own categories)
// DELETE /api/measurements/custom-categories/:id
//   -> 200 { message } once the row is gone, 404 when the account has no such
//   category (SparkyFitnessServer/routes/measurementRoutes.ts,
//   services/measurementService.ts deleteCustomCategory, which deletes only
//   that custom_categories row; the flow logs no entries in it).
// Only a category whose name is exactly this run's name is touched.

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
  ' Delete it by hand: Settings > Custom Measurements > the trash icon next to it > Delete.';

if (!present(output.categoryName)) {
  console.log(
    'measurements-custom-category-cleanup: the setup did not run, nothing to delete'
  );
} else if (!present(hostUrl) || !present(apiKey)) {
  // The setup refuses to run without both, so the form was never filled in.
  console.log(
    'measurements-custom-category-cleanup: missing SERVER_URL or API_KEY, nothing was created'
  );
} else {
  var BASE = String(hostUrl).replace(/\/+$/, '');
  var AUTH = { Authorization: 'Bearer ' + apiKey };
  var name = String(output.categoryName);

  var res = http.get(BASE + '/api/measurements/custom-categories', {
    headers: AUTH,
  });
  if (res.status !== 200) {
    throw new Error(
      'measurements-custom-category-cleanup: could not list categories to find "' +
        name +
        '" (HTTP ' +
        res.status +
        ').' +
        byHand
    );
  }
  var list = json(res.body);
  var categories = Array.isArray(list) ? list : [];
  var ours = categories.filter(function (c) {
    return c && present(c.id) && c.name === name;
  });

  if (ours.length === 0) {
    if (output.categorySaveTapped) {
      throw new Error(
        'measurements-custom-category-cleanup: Save was tapped but no "' +
          name +
          '" was found. If the app said "Failed to save category", nothing was created;' +
          ' otherwise look for it in Settings > Custom Measurements and delete it.'
      );
    }
    console.log(
      'measurements-custom-category-cleanup: Save was never tapped, nothing to delete'
    );
  } else {
    var failed = [];
    for (var i = 0; i < ours.length; i++) {
      var del = http.delete(
        BASE +
          '/api/measurements/custom-categories/' +
          encodeURIComponent(String(ours[i].id)),
        { headers: AUTH }
      );
      if (del.status !== 200) {
        failed.push('"' + ours[i].name + '" (HTTP ' + del.status + ')');
      }
    }
    if (failed.length > 0) {
      throw new Error(
        'measurements-custom-category-cleanup: not deleted: ' +
          failed.join(', ') +
          '.' +
          byHand
      );
    }
    console.log('measurements-custom-category-cleanup: deleted "' + name + '"');
  }
}
