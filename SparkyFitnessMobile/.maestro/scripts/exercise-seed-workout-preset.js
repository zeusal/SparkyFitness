// Creates one uniquely named, empty workout preset through the API, so the
// flow opens a preset only this run created. It has no exercises: then it
// references nothing else in the account, and deleting it removes everything
// this script made. Runs on the computer that runs `maestro` (GraalJS), not
// on the phone.
//
// Env: SERVER_URL or HOST_SERVER_URL, API_KEY (full access; read-only keys are
// refused on writes). Never print the key.
// Output: output.presetId, output.presetName, output.presetSearchTerm.

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
    'exercise-seed-workout-preset: pass -e SERVER_URL=<server as this computer reaches it>'
  );
}
if (!present(apiKey)) {
  throw new Error(
    'exercise-seed-workout-preset: pass -e API_KEY=<full-access key of the test account>'
  );
}

var BASE = String(hostUrl).replace(/\/+$/, '');
var searchTerm = String(Date.now());
var presetName = 'Maestro Preset ' + searchTerm;

// POST /api/workout-presets (SparkyFitnessServer/routes/workoutPresetRoutes.ts)
// answers 201 with the new preset, read back with its id
// (models/workoutPresetRepository.ts createWorkoutPreset). The body follows
// workoutPresetCreateRequestSchema (shared/src/schemas/api/WorkoutPresets.api.zod.ts):
// only name is required, exercises defaults to [], and the owner is the key's
// account. is_public false keeps it private to the test account.
var res = http.post(BASE + '/api/workout-presets', {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + apiKey,
  },
  body: JSON.stringify({
    name: presetName,
    description: 'Created by a Maestro flow; deleted when the flow ends.',
    is_public: false,
    exercises: [],
  }),
});

if (res.status !== 201) {
  throw new Error(
    'exercise-seed-workout-preset: POST /api/workout-presets -> HTTP ' +
      res.status +
      ' ' +
      String(res.body || '').slice(0, 300)
  );
}

var preset = json(res.body);
if (!present(preset.id)) {
  throw new Error(
    'exercise-seed-workout-preset: POST /api/workout-presets returned no id. Delete "' +
      presetName +
      '" by hand: Library > Workout presets > the preset > Delete preset.'
  );
}

output.presetId = String(preset.id);
output.presetName = presetName;
output.presetSearchTerm = searchTerm;
console.log('exercise-seed-workout-preset: created "' + presetName + '"');
