// Deletes the workout preset exercise-seed-workout-preset.js created, and
// nothing else, so repeated runs do not fill the test account. Runs from
// onFlowComplete, so it also cleans up after a failed step, but not after
// Ctrl+C or a killed run. Never print the key.
//
// DELETE /api/workout-presets/:id (SparkyFitnessServer/routes/workoutPresetRoutes.ts)
// answers 200 once the preset is gone, 403 when it is not one of this
// account's presets (services/workoutPresetService.ts deleteWorkoutPreset
// checks the owner first, so a missing id is a 403 too), 404 when the delete
// removed nothing.

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

if (!present(output.presetId)) {
  console.log(
    'exercise-cleanup-workout-preset: no test preset was created, nothing to delete'
  );
} else if (!present(hostUrl) || !present(apiKey)) {
  throw new Error(
    'exercise-cleanup-workout-preset: missing SERVER_URL or API_KEY, "' +
      output.presetName +
      '" left in place. Delete it by hand: Library > Workout presets > the preset > Delete preset.'
  );
} else {
  var BASE = String(hostUrl).replace(/\/+$/, '');
  var res = http.delete(
    BASE + '/api/workout-presets/' + encodeURIComponent(output.presetId),
    { headers: { Authorization: 'Bearer ' + apiKey } }
  );
  if (res.status !== 200) {
    throw new Error(
      'exercise-cleanup-workout-preset: "' +
        output.presetName +
        '" was not deleted (HTTP ' +
        res.status +
        '). Delete it by hand: Library > Workout presets > the preset > Delete preset.'
    );
  }
  console.log(
    'exercise-cleanup-workout-preset: deleted "' + output.presetName + '"'
  );
}
