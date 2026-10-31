import fs from 'fs';
import path from 'path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import {
  SHIPPED_LOCALES,
  SOURCE_LOCALE,
} from '../../src/localization/localeRegistry';

const require = createRequire(pathToFileURL(__filename));
const { localeFromAndroidDir } =
  require('../../scripts/androidLocaleQualifiers.cjs') as {
    localeFromAndroidDir: (name: string, source: string) => string | null;
  };

const TARGETS_ROOT = path.join(__dirname, '../../targets/android-widget');

const KOTLIN_ROOT = path.join(
  TARGETS_ROOT,
  'kotlin',
  'com',
  'sparkyapps',
  'sparkyfitness',
  'widget'
);
const RES_ROOT = path.join(TARGETS_ROOT, 'res');
const LOG_WATER_PATH = path.join(
  __dirname,
  '../../targets/android-background-water/kotlin/com/sparkyapps/sparkyfitness/backgroundwater/LogWaterActivity.kt'
);

/**
 * Discover every Android widget resource directory below `res/`, mapping
 * locale tags with the same helper the native validator uses.
 */
function discoverWidgetLocaleDirs(): Map<string, string> {
  const result = new Map<string, string>();
  for (const entry of fs.readdirSync(RES_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const locale = localeFromAndroidDir(entry.name, SOURCE_LOCALE);
    if (locale) result.set(locale, entry.name);
  }
  return result;
}

const WIDGET_LOCALE_DIRS = discoverWidgetLocaleDirs();
const SHIPPED_WIDGET_LOCALES = Object.keys(SHIPPED_LOCALES).filter((locale) =>
  WIDGET_LOCALE_DIRS.has(locale)
);

function readWidgetStringResources(
  locale: string = SOURCE_LOCALE
): { name: string; value: string }[] {
  const dir = WIDGET_LOCALE_DIRS.get(locale);
  if (!dir)
    throw new Error(
      `No Android widget resource directory for locale "${locale}"`
    );
  const xml = fs.readFileSync(
    path.join(RES_ROOT, dir, 'widget_strings.xml'),
    'utf8'
  );
  return extractStringResources(xml);
}

function extractStringResources(
  xml: string
): { name: string; value: string }[] {
  const result: { name: string; value: string }[] = [];
  const regex = /<string\b[^>]*\bname="([^"]+)"[^>]*>([^<]*)<\/string>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml)) !== null) {
    result.push({
      name: match[1],
      value: match[2].replace(/\\'/g, "'").replace(/&apos;/g, "'"),
    });
  }
  const declaredCount = (xml.match(/<string\b/g) ?? []).length;
  if (result.length !== declaredCount) {
    throw new Error(
      `Widget resource parser matched ${result.length} of ${declaredCount} string declarations`
    );
  }
  return result;
}

const REQUIRED_KEYS = [
  'sparky_calorie_widget_name',
  'sparky_widget_description',
  'sparky_macro_widget_name',
  'sparky_macro_widget_description',
  'widget_kcal_left',
  'widget_kcal_left_empty',
  'widget_grams',
  'widget_protein',
  'widget_carbs',
  'widget_fat',
  'widget_search_food',
  'widget_scan_barcode',
  'tile_log_water',
  'tile_calories_left',
  'widget_preview_calories_left',
  'widget_preview_macros_left',
  'widget_preview_grams_protein',
  'widget_preview_grams_carbs',
  'widget_preview_grams_fat',
  'sparky_water_widget_name',
  'sparky_water_widget_description',
  'widget_water_title',
  'widget_water_amount',
  'widget_water_amount_no_goal',
  'widget_water_amount_empty',
  'widget_water_unit_ml',
  'widget_water_unit_oz',
  'widget_water_unit_liter',
  'widget_water_add',
  'widget_water_remove',
  'widget_water_status_sign_in',
  'widget_water_status_pick_container',
  'widget_water_status_expired',
  'widget_water_status_unreachable',
  'widget_water_status_blocked',
  'widget_water_status_maybe_blocked',
  'widget_water_status_failed',
  'widget_water_status_nothing_to_remove',
  'widget_water_status_waiting',
  'widget_water_status_unconfirmed',
  'widget_preview_water_amount',
];

// Keys that existed only for the removed resize/responsive experiment layouts.
// A key without a consumer must not linger in any locale.
const DEAD_RESIZE_KEYS = [
  'widget_kcal_left_caption',
  'widget_kcal_left_value',
  'widget_preview_calories_value',
  'widget_preview_macros_value',
];

const FORBIDDEN_KOTLIN_LITERALS = [
  'kcal left',
  'Search food',
  'Scan barcode',
  '="Protein"',
  '="Carbs"',
  '="Fat"',
  '"Protein"',
  '"Carbs"',
  '"Fat"',
  'Locale.US',
];

const KOTLIN_TEMPLATES = [
  'CalorieWidget.kt.tmpl',
  'MacroWidget.kt.tmpl',
  'CalorieWidgetReceiver.kt.tmpl',
  'MacroWidgetReceiver.kt.tmpl',
  'WaterWidget.kt.tmpl',
  'WaterWidgetReceiver.kt.tmpl',
  'CalorieWidgetModule.kt.tmpl',
  'WidgetLocale.kt.tmpl',
  'QuickSettingsTiles.kt.tmpl',
];

const WIDGET_INFO_XMLS = [
  'sparky_calorie_widget_info.xml',
  'sparky_macro_widget_info.xml',
  'sparky_water_widget_info.xml',
];

describe('Android widget localization contract', () => {
  describe('string resources', () => {
    it('defines every required key in the default values', () => {
      const en = new Set(readWidgetStringResources().map((r) => r.name));
      for (const key of REQUIRED_KEYS) {
        expect(en.has(key)).toBe(true);
      }
    });

    it('discovers every shipped locale and the source widget resource directory', () => {
      // The source locale must always have a widget resource directory.
      expect(WIDGET_LOCALE_DIRS.has(SOURCE_LOCALE)).toBe(true);
      // Every shipped locale must have a corresponding Android widget resource directory.
      for (const locale of Object.keys(SHIPPED_LOCALES)) {
        expect(WIDGET_LOCALE_DIRS.has(locale)).toBe(true);
      }
    });

    it('does not require target widget key sets to match source (missing allowed, extra forbidden)', () => {
      // Android resource resolution falls back to default `values` when a key
      // is absent from `values-<locale>`. Missing keys are coverage diagnostics,
      // not blocking. Extra keys that do not exist in source remain blocking.
      const en = new Set(readWidgetStringResources().map((r) => r.name));
      for (const locale of SHIPPED_WIDGET_LOCALES) {
        if (locale === SOURCE_LOCALE) continue;
        const target = readWidgetStringResources(locale);
        for (const resource of target) {
          expect(en.has(resource.name)).toBe(true);
        }
      }
    });

    it('does not keep resource keys that lost their consumer after the resize removal', () => {
      for (const locale of SHIPPED_WIDGET_LOCALES) {
        const resources = new Set(
          readWidgetStringResources(locale).map((r) => r.name)
        );
        for (const key of DEAD_RESIZE_KEYS) {
          expect(resources.has(key)).toBe(false);
        }
      }
    });

    it('has non-empty source values (empty target values are allowed coverage gaps)', () => {
      const en = readWidgetStringResources();
      for (const resource of en) {
        expect(resource.value).not.toBe('');
      }
      // Target locale values may be empty (missing) — that is a non-blocking
      // coverage gap. Structural correctness of present values is verified by
      // the native widget validator and the placeholder tests below.
    });

    it('keeps the widget names distinct in every shipped locale', () => {
      const nameKeys = [
        'sparky_calorie_widget_name',
        'sparky_macro_widget_name',
        'sparky_water_widget_name',
      ];
      for (const locale of SHIPPED_WIDGET_LOCALES) {
        const strings = new Map(
          readWidgetStringResources(locale).map((r) => [r.name, r.value])
        );
        // An absent key is a non-blocking coverage gap that falls back to the
        // distinct English names; only a present pair can collapse two.
        const names = nameKeys
          .map((key) => strings.get(key))
          .filter((name): name is string => name !== undefined);
        expect(new Set(names).size).toBe(names.length);
      }
    });

    it('keeps placeholder positions compatible across all shipped widget locales', () => {
      const en = new Map(
        readWidgetStringResources().map((r) => [r.name, r.value])
      );
      const placeholderKeys = [
        'widget_kcal_left',
        'widget_grams',
        'widget_water_amount',
        'widget_water_amount_no_goal',
        'widget_water_amount_empty',
      ];
      for (const locale of SHIPPED_WIDGET_LOCALES) {
        if (locale === SOURCE_LOCALE) continue;
        const target = new Map(
          readWidgetStringResources(locale).map((r) => [r.name, r.value])
        );
        for (const key of placeholderKeys) {
          const enCount = (en.get(key)?.match(/%\d+\$[sd]/g) ?? []).length;
          const targetCount = (target.get(key)?.match(/%\d+\$[sd]/g) ?? [])
            .length;
          // Missing key: Android falls back to default `values` — allowed.
          if (!target.has(key) || target.get(key) === '') continue;
          expect(targetCount).toBe(enCount);
          expect(targetCount).toBeGreaterThan(0);
        }
      }
    });

    // Weblate writes a directory long before anyone ships it, so these assertions
    // cover the source and the registered locales; the rest are candidates and are
    // reported by the native validator instead.
    it('does not use i18next placeholder syntax in any shipped Android widget XML', () => {
      for (const locale of SHIPPED_WIDGET_LOCALES) {
        for (const resource of readWidgetStringResources(locale)) {
          expect(resource.value).not.toMatch(/\{\{/);
          expect(resource.value).not.toMatch(/\}\}/);
        }
      }
    });

    it('does not mix user data into resource values', () => {
      const en = readWidgetStringResources();
      for (const resource of en) {
        // Preview sample numbers are legitimate localized samples, not user data.
        if (resource.name.startsWith('widget_preview_')) continue;
        expect(resource.value).not.toMatch(/\b\d{2,4}\s*kcal\b/);
      }
    });
  });

  describe('Kotlin templates', () => {
    it('contains no forbidden hardcoded English user-facing literals', () => {
      for (const template of KOTLIN_TEMPLATES) {
        const src = fs.readFileSync(path.join(KOTLIN_ROOT, template), 'utf8');
        for (const literal of FORBIDDEN_KOTLIN_LITERALS) {
          expect(src).not.toContain(literal);
        }
      }
    });

    it('resolves widget labels through context.getString(R.string...)', () => {
      const calorieSrc = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'CalorieWidget.kt.tmpl'),
        'utf8'
      );
      expect(calorieSrc).toMatch(/R\.string\.widget_kcal_left/);
      expect(calorieSrc).toMatch(/R\.string\.widget_kcal_left_empty/);
      expect(calorieSrc).toMatch(/R\.string\.widget_search_food/);
      expect(calorieSrc).toMatch(/R\.string\.widget_scan_barcode/);
      // Classic one-line heading: no caption/value split in the calorie widget.
      expect(calorieSrc).not.toMatch(/R\.string\.widget_kcal_left_caption/);
      expect(calorieSrc).not.toMatch(/R\.string\.widget_kcal_left_value/);

      const macroSrc = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'MacroWidget.kt.tmpl'),
        'utf8'
      );
      for (const ref of [
        'widget_protein',
        'widget_carbs',
        'widget_fat',
        'widget_search_food',
        'widget_scan_barcode',
        'widget_kcal_left',
        'widget_kcal_left_empty',
        'widget_grams',
      ]) {
        expect(macroSrc).toMatch(new RegExp(`R\\.string\\.${ref}`));
      }
      // Classic one-line header: no caption/value split in the macro widget.
      expect(macroSrc).not.toMatch(/R\.string\.widget_kcal_left_caption/);
      expect(macroSrc).not.toMatch(/R\.string\.widget_kcal_left_value/);
    });

    it('renders the Quick Settings tiles in the widget language from resources', () => {
      const src = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'QuickSettingsTiles.kt.tmpl'),
        'utf8'
      );
      expect(src).toMatch(
        /render\(tile, WidgetLocale\.localizedContext\(this\)\)/
      );
      expect(src).toMatch(/context\.getString\(labelRes\)/);
      expect(src).toMatch(/R\.string\.widget_kcal_left/);
      // No label or subtitle set from a hardcoded string.
      expect(src).not.toMatch(/tile\.(label|subtitle) = "/);
    });

    it('erases every snapshot on an account change, in order with the writes', () => {
      const moduleSrc = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'CalorieWidgetModule.kt.tmpl'),
        'utf8'
      );
      expect(moduleSrc).toMatch(/fun clearSnapshots\(promise: Promise\)/);
      expect(moduleSrc).toMatch(/\.remove\(prefsKey\)\.commit\(\)/);
      // Every widget, its stored copy and every instance's state, each part
      // tried and redrawn past one that fails.
      expect(moduleSrc).toMatch(
        /CalorieWidgetReceiver\.PREFS_KEY_SNAPSHOT,\s*\n\s*CalorieWidget\(\),\s*\n\s*CalorieWidget\.SNAPSHOT_STATE_KEY/
      );
      expect(moduleSrc).toMatch(
        /MacroWidgetReceiver\.PREFS_KEY_SNAPSHOT,\s*\n\s*MacroWidget\(\),\s*\n\s*MacroWidget\.SNAPSHOT_STATE_KEY/
      );
      expect(moduleSrc).toMatch(
        /WaterWidgetReceiver\.PREFS_KEY_SNAPSHOT,\s*\n\s*WaterWidget\(\),\s*\n\s*WaterWidget\.SNAPSHOT_STATE_KEY/
      );
      // The water taps not yet sent were made for the previous account.
      expect(moduleSrc).toMatch(/\+ clearWaterWidget\(ctx\)/);
      expect(moduleSrc).toMatch(
        /WaterWidgetStore\.onAccountChangedLocked\(ctx\)/
      );
      expect(moduleSrc).toMatch(
        /updateAppWidgetState\(ctx, id\) \{ state -> state\.remove\(stateKey\) \}\s*\n\s*widget\.update\(ctx, id\)/
      );
      expect(moduleSrc.match(/failures \+= /g)?.length).toBeGreaterThanOrEqual(
        3
      );
      // Writes and the clear share one serial executor and one lock, so a
      // write for the previous account cannot land after the clear. The
      // water widget's buttons, worker and receiver take the same lock.
      expect(
        moduleSrc.match(/moduleScope\.launch\(snapshotWrites\)/g)
      ).toHaveLength(4);
      expect(
        moduleSrc.match(/WidgetSnapshotLock\.mutex\.withLock \{/g)
      ).toHaveLength(4);
      expect(moduleSrc).not.toMatch(/= Mutex\(\)/);

      // A live Glance session reads the stored copy at composition instead of
      // one captured at its start, which would bring a cleared snapshot back.
      for (const template of ['CalorieWidget.kt.tmpl', 'MacroWidget.kt.tmpl']) {
        const src = fs.readFileSync(path.join(KOTLIN_ROOT, template), 'utf8');
        expect(src).not.toMatch(/fallbackSnapshot/);
        expect(src).toMatch(
          /parseSnapshot\(state\[SNAPSHOT_STATE_KEY\]\) \?: loadSnapshot\(context\)/
        );
      }
      const waterSrc = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidget.kt.tmpl'),
        'utf8'
      );
      expect(waterSrc).toMatch(
        /WaterWidgetStore\.parse\(state\[SNAPSHOT_STATE_KEY\]\)\s*\n\s*\?: WaterWidgetStore\.loadSnapshot\(context\)/
      );
    });

    it('keeps every water snapshot change under the shared widget lock', () => {
      const lock = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WidgetSnapshots.kt'),
        'utf8'
      );
      expect(lock).toMatch(
        /object WidgetSnapshotLock \{\s*val mutex = Mutex\(\)/
      );

      const store = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidgetStore.kt'),
        'utf8'
      );
      // Everything that writes the snapshot says it needs the lock held.
      for (const fn of [
        'mergeFromAppLocked',
        'addTapLocked',
        'takePendingLocked',
        'applyOutcomeLocked',
        'applyTotalsLocked',
        'onAccountChangedLocked',
      ]) {
        expect(store).toMatch(new RegExp(`fun ${fn}\\(`));
      }
      // A late answer for the previous account is dropped.
      expect(store).toMatch(
        /if \(accountEpoch\(context\) != batch\.accountEpoch\) return/
      );
      expect(store).toMatch(/cancelUniqueWork\(WORK_NAME\)/);
      // Taps go out in order, one request at a time.
      expect(store).toMatch(/ExistingWorkPolicy\.APPEND_OR_REPLACE/);

      const actions = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidgetActions.kt'),
        'utf8'
      );
      expect(
        actions.match(/WidgetSnapshotLock\.mutex\.withLock \{/g)
      ).toHaveLength(4);
      // A worker first forgets taps an earlier one took and never answered
      // (stopped, or its process died), so they do not inflate the total.
      const doWork = actions.slice(
        actions.indexOf('override suspend fun doWork')
      );
      expect(doWork.indexOf('reclaimSendingLocked(context)')).toBeGreaterThan(
        -1
      );
      expect(doWork.indexOf('reclaimSendingLocked(context)')).toBeLessThan(
        doWork.indexOf('while (true)')
      );
      // A success for a day the app has since moved past changes nothing (a
      // failure there is pinned further down), and a shortcut total sent
      // before an account change is dropped.
      expect(store).toMatch(
        /if \(obj\.optString\("date", ""\) != batch\.date\) \{\s*(\/\/[^\n]*\s*)*if \(outcome is WaterChangeOutcome\.Changed\) return\s/
      );
      expect(store).toMatch(
        /if \(accountEpoch != null && accountEpoch != accountEpoch\(context\)\) return/
      );
      // The manual part comes with every push and is never carried over.
      const merge = store.slice(
        store.indexOf('suspend fun mergeFromAppLocked'),
        store.indexOf('suspend fun addTapLocked')
      );
      expect(merge).not.toMatch(/manualMl/);
      expect(merge).toMatch(
        /if \(!isSnapshotToday\(incoming\.optString\("date", ""\)\)\) return/
      );
      // The request itself is made outside the lock.
      expect(actions).toMatch(
        /withContext\(Dispatchers\.IO\) \{ postWaterChange\(context, batch\.drinks, batch\.entryDate\) \}/
      );

      const receiver = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidgetReceiver.kt.tmpl'),
        'utf8'
      );
      expect(receiver).toMatch(
        /WidgetSnapshotLock\.mutex\.withLock \{\s*\n\s*WaterWidgetStore\.applyTotalsLocked/
      );
    });

    it('waits for a usable network and sends each drink dated the day it was tapped', () => {
      const logWater = fs.readFileSync(LOG_WATER_PATH, 'utf8');
      const store = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidgetStore.kt'),
        'utf8'
      );
      const actions = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidgetActions.kt'),
        'utf8'
      );
      // Both requests declare that they need a network: WorkManager then
      // waits for one instead of starting a run that is bound to fail, and
      // an expedited job may use it under battery saver (Android 14 QPR2+).
      expect(logWater).toMatch(
        /fun waterRequestConstraints\(\): Constraints =\s*Constraints\.Builder\(\)\.setRequiredNetworkType\(NetworkType\.CONNECTED\)\.build\(\)/
      );
      expect(store).toMatch(/\.setConstraints\(waterRequestConstraints\(\)\)/);
      const enqueueLogWater = logWater.slice(
        logWater.indexOf('fun enqueueLogWater('),
        logWater.indexOf('class LogWaterWorker')
      );
      expect(enqueueLogWater).toMatch(
        /\.setConstraints\(waterRequestConstraints\(\)\)/
      );
      // A tap with no usable network says it is waiting.
      expect(actions).toMatch(/val waiting = !hasUsableNetwork\(context\)/);
      expect(actions).toMatch(
        /WaterWidgetStore\.addTapLocked\(context, change, waiting\)/
      );
      expect(store).toMatch(
        /if \(waiting\) obj\.put\(KEY_STATUS, STATUS_WAITING\) else obj\.remove\(KEY_STATUS\)/
      );
      // A new day moves the taps still waiting under the day they were made,
      // out of the new day's figures, and they go out first, dated that day.
      const merge = store.slice(
        store.indexOf('suspend fun mergeFromAppLocked'),
        store.indexOf('suspend fun addTapLocked')
      );
      expect(merge).toMatch(
        /keepEarlier\(incoming, stored\.optString\("date"\), pending\)/
      );
      expect(store).toMatch(
        /return Batch\(drinks, accountEpoch\(context\), date, entryDate = earliestDay, fromEarlier = true\)/
      );
      expect(store).toMatch(
        /return Batch\(drinks, accountEpoch\(context\), date, entryDate = date, fromEarlier = false\)/
      );
      expect(logWater).toMatch(/\.put\("entry_date", entryDate\)/);
      // The shortcut and the tile keep the tap's day and account, and never
      // post again after a stopped run, as the server logs every request.
      expect(enqueueLogWater).toMatch(/KEY_ENTRY_DATE to today\(\)/);
      expect(enqueueLogWater).toMatch(
        /KEY_ACCOUNT_EPOCH to waterWidgetAccountEpoch\(context\)/
      );
      const doWork = logWater.slice(logWater.indexOf('class LogWaterWorker'));
      expect(doWork.indexOf('if (runAttemptCount > 0)')).toBeGreaterThan(-1);
      expect(doWork.indexOf('if (runAttemptCount > 0)')).toBeLessThan(
        doWork.indexOf('postWaterChange(')
      );
      expect(doWork).toMatch(
        /if \(accountEpoch != waterWidgetAccountEpoch\(applicationContext\)\) \{[\s\S]*?return Result\.success\(\)/
      );
      expect(doWork).toMatch(
        /val entryDate = inputData\.getString\(KEY_ENTRY_DATE\) \?: today\(\)/
      );
      expect(doWork).toMatch(
        /postWaterChange\(applicationContext, 1, entryDate\)/
      );
      // The shortcut and the tile say at once that a drink waits, and their
      // drinks go out one at a time in the order they were tapped.
      expect(enqueueLogWater).toMatch(
        /val waiting = !hasUsableNetwork\(context\)\s*if \(waiting && fromTile\) notify\(context, LogWaterResult\(false, WAITING_MESSAGE, waiting = true\)\)/
      );
      expect(enqueueLogWater.indexOf('val waiting')).toBeLessThan(
        enqueueLogWater.indexOf('enqueueUniqueWork(')
      );
      expect(enqueueLogWater).toMatch(
        /enqueueUniqueWork\(LOG_WATER_WORK, ExistingWorkPolicy\.APPEND_OR_REPLACE, request\)/
      );
      expect(logWater).toMatch(
        /if \(enqueueLogWater\(applicationContext\)\) \{\s*Toast\.makeText\(applicationContext, WAITING_MESSAGE, Toast\.LENGTH_LONG\)\.show\(\)/
      );
      // The result replaces the waiting notice, and the dropped cases say so.
      expect(logWater).toMatch(
        /private fun report\([^)]*\) \{\s*NotificationManagerCompat\.from\(context\)\.cancel\(WAITING_NOTIFICATION_ID\)/
      );
      const rerun = doWork.slice(
        doWork.indexOf('if (runAttemptCount > 0)'),
        doWork.indexOf('val accountEpoch')
      );
      expect(rerun).toMatch(/report\(/);
      expect(rerun).toMatch(/return Result\.success\(\)/);
      const accountGuard = doWork.slice(
        doWork.indexOf('if (accountEpoch != waterWidgetAccountEpoch'),
        doWork.indexOf('val entryDate')
      );
      expect(accountGuard).toMatch(/report\(/);
      expect(accountGuard).toMatch(/return Result\.success\(\)/);
      expect(doWork).toMatch(
        /val accountEpoch = inputData\.getLong\(KEY_ACCOUNT_EPOCH, 0L\)/
      );
      // A stopped run stays quiet once its request ends, so its rerun gives
      // the drink's only answer.
      const answer = doWork.slice(
        doWork.indexOf('val outcome = postWaterChange(')
      );
      expect(
        answer.indexOf('if (isStopped) return Result.success()')
      ).toBeGreaterThan(-1);
      expect(
        answer.indexOf('if (isStopped) return Result.success()')
      ).toBeLessThan(answer.indexOf('showTotalOnWaterWidget('));
      expect(rerun).toMatch(/LogWaterResult\(false, unconfirmedMessage\(\)\)/);
      // An earlier day's drink never sets today's figure on the widget.
      expect(doWork).toMatch(
        /if \(outcome is WaterChangeOutcome\.Changed && entryDate == today\(\)\) \{\s*showTotalOnWaterWidget/
      );
      // The earliest waiting day goes first, and a push keeps the waiting
      // days and sends them.
      expect(store).toMatch(
        /filter \{ earlier\.optInt\(it, 0\) != 0 \}\?\.minOrNull\(\)/
      );
      expect(merge).toMatch(
        /stored\.optJSONObject\(KEY_EARLIER\)\?\.let \{ incoming\.put\(KEY_EARLIER, it\) \}/
      );
      // A new day forgets an ended day's request still out, as it forgets
      // today's: its answer no longer takes back a count.
      const sameDay = merge.slice(
        merge.indexOf(
          'if (stored.optString("date") == incoming.optString("date"))'
        ),
        merge.indexOf('} else if (pending != 0)')
      );
      expect(sameDay).toMatch(/incoming\.put\(KEY_EARLIER_SENDING/);
      expect(merge.match(/incoming\.put\(KEY_EARLIER_SENDING/g)).toHaveLength(
        1
      );
      const module = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'CalorieWidgetModule.kt.tmpl'),
        'utf8'
      );
      expect(module).toMatch(
        /if \(WaterWidgetStore\.mergeFromAppLocked\(ctx, json\)\) WaterWidgetStore\.enqueueSend\(ctx\)/
      );
      // An earlier day's batch is counted apart from today's, where it was
      // taken from, and only taps of the snapshot's day set today's figure.
      const apply = store.slice(
        store.indexOf('suspend fun applyOutcomeLocked'),
        store.indexOf('private fun putFailureStatus(')
      );
      // One batch is out at a time, so its counter is taken back only while
      // it still holds the batch (a date that went back and forth may have
      // replaced it).
      expect(apply).toMatch(
        /val counter = if \(batch\.fromEarlier\) KEY_EARLIER_SENDING else KEY_SENDING\s*if \(obj\.optInt\(counter, 0\) == batch\.drinks\) obj\.remove\(counter\)/
      );
      expect(apply).toMatch(/val forToday = batch\.entryDate == batch\.date/);
      expect(apply).toMatch(
        /is WaterChangeOutcome\.Changed -> if \(forToday\) \{/
      );
      // A failure keeps an ended day's drinks, and puts the batch back when
      // sending it again may go through, even once a new day's push has
      // forgotten the request, where it also drops the new day's waiting
      // taps, as any failure does; the worker then stops instead of looping.
      const otherDay = apply.slice(
        apply.indexOf('if (obj.optString("date", "") != batch.date) {'),
        apply.indexOf('val before = ')
      );
      expect(otherDay).toMatch(
        /if \(outcome is WaterChangeOutcome\.Changed\) return\s*val shown = isSnapshotToday\(obj\.optString\("date", ""\)\)\s*(\/\/[^\n]*\s*)*val kept = !\(shown && isSnapshotToday\(batch\.entryDate\)\) && worthSendingAgain\(outcome\)\s*if \(kept\) keepEarlier\(obj, batch\.entryDate, batch\.drinks\)/
      );
      // Only a snapshot that is shown gets a status, and its dropped taps
      // are marked, so later kept drinks never show as waiting over them.
      expect(otherDay).toMatch(
        /if \(shown\) \{\s*val droppedToday = obj\.optInt\(KEY_PENDING, 0\) != 0 \|\| isSnapshotToday\(batch\.entryDate\)\s*if \(droppedToday\) \{\s*obj\.put\(KEY_PENDING, 0\)\s*obj\.put\(KEY_DROPPED, true\)\s*\}\s*putFailureStatus\(obj, outcome, onlyKept = kept && !droppedToday\)\s*\}/
      );
      expect(apply.slice(apply.indexOf('else -> {'))).toMatch(
        /val shown = isSnapshotToday\(batch\.date\)\s*(\/\/[^\n]*\s*)*val kept = !\(shown && isSnapshotToday\(batch\.entryDate\)\) && worthSendingAgain\(outcome\)/
      );
      expect(apply).toMatch(
        /if \(kept\) \{\s*if \(batch\.fromEarlier\) \{\s*keepEarlier\(obj, batch\.entryDate, batch\.drinks\)\s*\} else \{\s*obj\.put\(KEY_PENDING, obj\.optInt\(KEY_PENDING, 0\) \+ batch\.drinks\)/
      );
      // A failure that only kept drinks to send again says they wait, and
      // "may not have been saved" is not replaced by an error that would
      // invite another tap.
      const sameDayFailure = apply.slice(apply.indexOf('else -> {'));
      expect(sameDayFailure).toMatch(
        /val shown = isSnapshotToday\(batch\.date\)[\s\S]*?val droppedToday = shown && \(forToday \|\| obj\.optInt\(KEY_PENDING, 0\) != 0\)/
      );
      expect(sameDayFailure).toMatch(
        /if \(droppedToday\) obj\.put\(KEY_DROPPED, true\)/
      );
      // Only the day shown loses its waiting taps, and the outcome never
      // touches earlierDrinks but through keepEarlier, so an ended day's
      // drinks survive a failure.
      expect(sameDayFailure).toMatch(
        /if \(shown\) \{\s*obj\.put\(KEY_PENDING, 0\)\s*obj\.put\(KEY_SENDING, 0\)\s*\}/
      );
      expect(apply).not.toMatch(/\bKEY_EARLIER\b/);
      expect(sameDayFailure).toMatch(
        /if \(shown\) putFailureStatus\(obj, outcome, onlyKept = kept && !droppedToday\)/
      );
      expect(apply).not.toMatch(/obj\.put\(KEY_STATUS, statusFor\(outcome\)\)/);
      const failureStatus = store.slice(
        store.indexOf('private fun putFailureStatus('),
        store.indexOf('private fun keepEarlier(')
      );
      expect(failureStatus).toMatch(
        /val current = obj\.optString\(KEY_STATUS\)\s*if \(current == STATUS_UNCONFIRMED\) return/
      );
      // Kept drinks show as waiting unless the person has to act first, and
      // never over an error already showing, which may be the one that
      // dropped today's taps.
      expect(failureStatus).toMatch(
        /val actFirst = outcome == WaterChangeOutcome\.NotSignedIn \|\|\s*outcome == WaterChangeOutcome\.NoContainer \|\| outcome == WaterChangeOutcome\.Expired/
      );
      expect(failureStatus).toMatch(
        /if \(!onlyKept \|\| actFirst \|\| obj\.optBoolean\(KEY_DROPPED, false\)\) \{\s*obj\.put\(KEY_STATUS, statusFor\(outcome\)\)\s*\} else if \(current\.isEmpty\(\) \|\| current == STATUS_WAITING \|\| current == STATUS_NOTHING_TO_REMOVE\) \{\s*obj\.put\(KEY_STATUS, STATUS_WAITING\)/
      );
      // The mark lasts until the next tap or app push: a tap clears it, and
      // a push builds the snapshot without it.
      expect(store).toMatch(
        /obj\.put\(KEY_PENDING, snapshot\.pendingDrinks \+ change\)\s*obj\.remove\(KEY_DROPPED\)/
      );
      expect(merge).not.toMatch(/KEY_DROPPED/);
      expect(store).toMatch(
        /is WaterChangeOutcome\.Unreachable -> !outcome\.requestSent/
      );
      // A refusal that may pass later (408, 429) keeps an ended day's
      // drinks; any other redirect or 4xx would be refused at every send.
      expect(store).toMatch(
        /is WaterChangeOutcome\.Failed -> outcome\.status == 408 \|\| outcome\.status == 429/
      );
      expect(actions).toMatch(
        /if \(outcome !is WaterChangeOutcome\.Changed\) return Result\.success\(\)/
      );
      // "Waiting to send" shows only while something waits, and a worker
      // that forgets taps another one took says they may not have gone out.
      expect(store).toMatch(
        /takeUnless \{ it == STATUS_WAITING && pending == 0 && sending == 0 && earlier == 0 \}/
      );
      const reclaim = store.slice(
        store.indexOf('suspend fun reclaimSendingLocked'),
        store.indexOf('suspend fun takePendingLocked')
      );
      expect(reclaim).toMatch(/obj\.put\(KEY_STATUS, STATUS_UNCONFIRMED\)/);
      const widget = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidget.kt.tmpl'),
        'utf8'
      );
      expect(widget).toMatch(
        /WaterWidgetStore\.STATUS_WAITING -> R\.string\.widget_water_status_waiting/
      );
      expect(widget).toMatch(
        /WaterWidgetStore\.STATUS_UNCONFIRMED -> R\.string\.widget_water_status_unconfirmed/
      );
    });

    it('tells a phone that keeps the app offline in the background from an unreachable server', () => {
      const logWater = fs.readFileSync(LOG_WATER_PATH, 'utf8');
      // The connection opens before anything is written, so a failure while
      // connecting never reached the server; only that one can be a block.
      const post = logWater.slice(logWater.indexOf('fun postWaterChange('));
      expect(post.indexOf('phase = "connecting"')).toBeGreaterThan(-1);
      expect(post.indexOf('connection.connect()')).toBeGreaterThan(
        post.indexOf('phase = "connecting"')
      );
      expect(post.indexOf('connection.outputStream')).toBeGreaterThan(
        post.indexOf('connection.connect()')
      );
      // A failure from here on may have reached the server.
      expect(post.indexOf('phase = "sending"')).toBeGreaterThan(
        post.indexOf('connection.connect()')
      );
      expect(post.indexOf('phase = "sending"')).toBeLessThan(
        post.indexOf('connection.outputStream')
      );
      expect(logWater).toMatch(
        /\(if \(phase == "connecting"\) blockedOutcome\(context, e\) else null\)\s*\?: WaterChangeOutcome\.Unreachable\(requestSent = phase == "sending"\)/
      );
      // Only a block Android reports, or a socket the phone refused, is
      // called a block. A failed lookup may also be a server name that does
      // not resolve from here (umbrel.local away from home), so it is hedged.
      const classify = logWater.slice(
        logWater.indexOf('private fun blockedOutcome('),
        logWater.indexOf('private fun phoneIsOnline(')
      );
      expect(classify).toMatch(
        /DetailedState\.BLOCKED\) \{\s*return WaterChangeOutcome\.Blocked/
      );
      expect(classify).toMatch(
        /error is SocketException && error\.message\?\.contains\("EPERM"\) == true\) return WaterChangeOutcome\.Blocked/
      );
      expect(classify).toMatch(
        /error !is UnknownHostException \|\| !phoneIsOnline\(connectivity\)\) return null/
      );
      expect(classify).toMatch(
        /isIgnoringBatteryOptimizations\(context\.packageName\)\) null else WaterChangeOutcome\.MaybeBlocked/
      );
      expect(classify).not.toMatch(
        /UnknownHostException[^\n]*WaterChangeOutcome\.Blocked/
      );
      // The real error is logged, without the URL or the headers, and its
      // message only for a failure on the network: one from setting a header
      // can quote the header's value.
      const logLine =
        logWater.match(/Log\.w\(TAG, "Water change failed[^\n]*\)/)?.[0] ?? '';
      expect(logLine).toContain('e.javaClass.simpleName');
      expect(logLine).not.toMatch(/baseUrl|headers|config|e\.message/);
      expect(logWater).toMatch(
        /val detail = if \(phase == "connecting" \|\| phase == "sending"\) ": \$\{e\.message\}" else ""/
      );
      // The shortcut and the tile say how to fix it; the tile's notification
      // opens App info.
      expect(logWater).toMatch(
        /WaterChangeOutcome\.Blocked -> LogWaterResult\([\s\S]*?opensAppInfo = true/
      );
      expect(logWater).toMatch(
        /WaterChangeOutcome\.MaybeBlocked -> LogWaterResult\([\s\S]*?opensAppInfo = true/
      );
      expect(logWater).toMatch(
        /if \(result\.opensAppInfo\) \{\s*appInfoIntent\(context\)/
      );

      const store = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidgetStore.kt'),
        'utf8'
      );
      // Every outcome is mapped, so a new one cannot read as "Could not log".
      const statusFor = store.slice(
        store.indexOf('private fun statusFor('),
        store.indexOf('private fun accountEpoch(')
      );
      expect(statusFor).toMatch(
        /WaterChangeOutcome\.Blocked -> STATUS_BLOCKED/
      );
      expect(statusFor).toMatch(
        /WaterChangeOutcome\.MaybeBlocked -> STATUS_MAYBE_BLOCKED/
      );
      expect(statusFor).not.toMatch(/else ->/);
      // A request that may have reached the server never invites another
      // tap, which would log the drink twice: one sent with no answer, or a
      // server error that is not a redirect or a 4xx.
      expect(logWater).toMatch(
        /data class Failed\(val status: Int\) : WaterChangeOutcome\(\) \{\s*override val mayHaveLogged: Boolean get\(\) = status !in 300\.\.499/
      );
      expect(logWater).toMatch(
        /data class Unreachable\(val requestSent: Boolean\) : WaterChangeOutcome\(\) \{\s*override val mayHaveLogged: Boolean get\(\) = requestSent/
      );
      expect(statusFor).toMatch(
        /is WaterChangeOutcome\.Unreachable -> if \(outcome\.mayHaveLogged\) STATUS_UNCONFIRMED else STATUS_UNREACHABLE/
      );
      expect(statusFor).toMatch(
        /is WaterChangeOutcome\.Failed -> if \(outcome\.mayHaveLogged\) STATUS_UNCONFIRMED else STATUS_FAILED/
      );
      expect(logWater).toMatch(
        /is WaterChangeOutcome\.Unreachable -> if \(outcome\.mayHaveLogged\) \{\s*LogWaterResult\(false, unconfirmedMessage\(\)\)/
      );
      expect(logWater).toMatch(
        /is WaterChangeOutcome\.Failed -> if \(outcome\.mayHaveLogged\) \{\s*LogWaterResult\(false, unconfirmedMessage\(outcome\.status\)\)/
      );

      const widget = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidget.kt.tmpl'),
        'utf8'
      );
      expect(widget).toMatch(
        /WaterWidgetStore\.STATUS_BLOCKED -> R\.string\.widget_water_status_blocked/
      );
      expect(widget).toMatch(
        /WaterWidgetStore\.STATUS_MAYBE_BLOCKED -> R\.string\.widget_water_status_maybe_blocked/
      );
      // While blocked, a tap on the widget opens App info.
      expect(widget).toMatch(
        /val blocked = snapshot\?\.status == WaterWidgetStore\.STATUS_BLOCKED \|\|\s*snapshot\?\.status == WaterWidgetStore\.STATUS_MAYBE_BLOCKED/
      );
      expect(widget).toMatch(
        /val tapIntent = if \(blocked\) \{\s*appInfoIntent\(context\)/
      );
      expect(widget).toMatch(/\.clickable\(actionStartActivity\(tapIntent\)\)/);
    });

    it('shows the water buttons only for a container that logs plain water', () => {
      const store = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidgetStore.kt'),
        'utf8'
      );
      expect(store).toMatch(
        /val showsButtons: Boolean = canLog && \(drinkMl \?: 0\.0\) > 0\.0/
      );
      const src = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidget.kt.tmpl'),
        'utf8'
      );
      expect(src).toMatch(/if \(snapshot\?\.showsButtons == true\)/);
      expect(src).toMatch(/actionRunCallback<WaterChangeAction>/);
      // A greyed-out − stays clickable with a change of 0, which does
      // nothing, so the tap never reaches the open-the-app action behind it.
      expect(src).toMatch(/CHANGE_KEY to if \(enabled\) change else 0/);
      const actions = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidgetActions.kt'),
        'utf8'
      );
      expect(actions).toMatch(/if \(change == 0\) return/);
      // cornerRadius is a no-op before Android 12, so the buttons' shape
      // comes from a drawable there, in a light and a night colour.
      expect(src).toMatch(
        /Build\.VERSION\.SDK_INT >= Build\.VERSION_CODES\.S[\s\S]*R\.drawable\.bg_widget_water_button/
      );
      expect(src).toMatch(
        /if \(roundsCorners\) 0 else R\.drawable\.bg_widget_water_button_ripple/
      );
      expect(
        fs.readFileSync(
          path.join(RES_ROOT, 'drawable', 'bg_widget_water_button_ripple.xml'),
          'utf8'
        )
      ).toMatch(/<corners android:radius="20dp" \/>/);
      for (const dir of ['drawable', 'drawable-night']) {
        expect(
          fs.readFileSync(
            path.join(RES_ROOT, dir, 'bg_widget_water_button.xml'),
            'utf8'
          )
        ).toMatch(/<corners android:radius="20dp" \/>/);
      }
      expect(src).toMatch(
        /contentDescription = widgetContext\.getString\(R\.string\.widget_water_add\)/
      );
      // A greyed-out − is announced as having nothing to remove.
      expect(src).toMatch(
        /if \(snapshot\.canRemove\) \{\s*R\.string\.widget_water_remove\s*\} else \{\s*R\.string\.widget_water_status_nothing_to_remove\s*\}/
      );
      // Amounts use the widget locale's separators.
      expect(src).toMatch(
        /NumberFormat\.getNumberInstance\(currentWidgetLocale\(context\)\)/
      );
    });

    it('localizes accessibility labels in the Kotlin widgets', () => {
      for (const template of ['CalorieWidget.kt.tmpl', 'MacroWidget.kt.tmpl']) {
        const src = fs.readFileSync(path.join(KOTLIN_ROOT, template), 'utf8');
        expect(src).toMatch(
          /widgetContext\.getString\(R\.string\.widget_search_food\)/
        );
        expect(src).toMatch(
          /widgetContext\.getString\(R\.string\.widget_scan_barcode\)/
        );
        expect(src).toMatch(/contentDescription = searchFoodLabel/);
        expect(src).toMatch(/contentDescription = scanBarcodeLabel/);
      }
    });

    it('uses locale-aware number formatting without hardcoding English separators', () => {
      const helper = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WidgetLocale.kt.tmpl'),
        'utf8'
      );
      expect(helper).toMatch(/NumberFormat\.getIntegerInstance/);
      expect(helper).not.toContain('String.format(Locale.US');
      expect(helper).not.toContain('%,d');

      for (const template of ['CalorieWidget.kt.tmpl', 'MacroWidget.kt.tmpl']) {
        const src = fs.readFileSync(path.join(KOTLIN_ROOT, template), 'utf8');
        expect(src).toMatch(/formatWidgetInt\(/);
        expect(src).not.toContain('String.format(Locale.US');
        expect(src).not.toContain('%,d');
      }
    });

    it('keeps the pre-localization per-widget rounding (calorie truncates, macro rounds)', () => {
      const calorieSrc = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'CalorieWidget.kt.tmpl'),
        'utf8'
      );
      // PR3 behavior (22415819): calorie widget truncates 1240.7 -> 1240.
      expect(calorieSrc).toMatch(
        /formatWidgetInt\(context, value\.toLong\(\)\)/
      );
      expect(calorieSrc).not.toMatch(/\.roundToLong\(\)/);

      const macroSrc = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'MacroWidget.kt.tmpl'),
        'utf8'
      );
      // PR3 behavior (22415819): macro widget rounds 1240.7 -> 1241.
      expect(macroSrc).toMatch(
        /formatWidgetInt\(context, value\.roundToLong\(\)\)/
      );
      expect(macroSrc).not.toMatch(/value\.toLong\(\)/);

      // The shared helper formats ONLY: locale-aware separators, no business
      // rounding inside it (each caller keeps its pre-localization rule).
      const helper = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WidgetLocale.kt.tmpl'),
        'utf8'
      );
      expect(helper).toMatch(
        /fun formatWidgetInt\(context: Context, value: Long\)/
      );
      expect(helper).not.toMatch(/roundToLong/);
      expect(helper).not.toMatch(/\.toLong\(\)/);
    });

    it('sets the next midnight alarm even when the midnight redraw fails', () => {
      // Each alarm fires once: a redraw that threw used to crash the process
      // and leave no alarm for the following night.
      for (const receiver of [
        'CalorieWidgetReceiver.kt.tmpl',
        'MacroWidgetReceiver.kt.tmpl',
      ]) {
        const src = fs.readFileSync(path.join(KOTLIN_ROOT, receiver), 'utf8');
        const midnight = src.slice(
          src.indexOf('if (intent.action == ACTION_MIDNIGHT_REFRESH)'),
          src.indexOf('if (intent.action == Intent.ACTION_LOCALE_CHANGED)')
        );
        expect(midnight).toMatch(
          /catch \(e: CancellationException\) \{\s*throw e\s*\} catch \(e: Exception\)/
        );
        expect(midnight).toMatch(
          /\} finally \{[\s\S]*scheduleMidnightRefresh\(context\)[\s\S]*pending\.finish\(\)/
        );
      }
    });

    it('updates every GlanceId and continues past a failing instance', () => {
      const moduleSrc = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'CalorieWidgetModule.kt.tmpl'),
        'utf8'
      );
      expect(moduleSrc).toMatch(
        /getGlanceIds\(CalorieWidget::class\.java\)\.forEach/
      );
      expect(moduleSrc).toMatch(
        /getGlanceIds\(MacroWidget::class\.java\)\.forEach/
      );
      expect(moduleSrc).toMatch(
        /getGlanceIds\(WaterWidget::class\.java\)\.forEach/
      );
      expect(moduleSrc).not.toMatch(/getGlanceIds\([^)]*\)\[0\]/);
      expect(moduleSrc).toMatch(/catch \(e: CancellationException\)/);
      expect(moduleSrc).toMatch(/var firstFailure: Exception\?/);
    });

    it('keeps the midnight refresh mechanism with distinct alarm actions', () => {
      const calorieReceiver = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'CalorieWidgetReceiver.kt.tmpl'),
        'utf8'
      );
      const macroReceiver = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'MacroWidgetReceiver.kt.tmpl'),
        'utf8'
      );
      const waterReceiver = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WaterWidgetReceiver.kt.tmpl'),
        'utf8'
      );

      // Each receiver's alarm carries its own action, so one widget's
      // alarm never replaces another's.
      const actions = new Set<string>();
      for (const src of [calorieReceiver, macroReceiver, waterReceiver]) {
        expect(src).toMatch(/ACTION_MIDNIGHT_REFRESH/);
        expect(src).toMatch(/updateAll\(context\)/);
        expect(src).toMatch(/scheduleMidnightRefresh\(context\)/);
        expect(src).toMatch(/cancelMidnightRefresh\(context\)/);
        expect(src).toMatch(/setAndAllowWhileIdle/);
        actions.add(
          src.match(/ACTION_MIDNIGHT_REFRESH =\s*\n?\s*"([^"]+)"/)?.[1] ??
            'missing'
        );
      }
      expect(actions.size).toBe(3);
      // The water receiver sets the next alarm even when its redraw fails,
      // since each alarm fires once.
      const waterMidnight = waterReceiver.slice(
        waterReceiver.indexOf('if (intent.action == ACTION_MIDNIGHT_REFRESH)'),
        waterReceiver.indexOf(
          'if (intent.action == Intent.ACTION_LOCALE_CHANGED)'
        )
      );
      expect(waterMidnight).toMatch(
        /catch \(e: CancellationException\) \{\s*throw e\s*\} catch \(e: Exception\)/
      );
      expect(waterMidnight).toMatch(
        /\} finally \{[\s\S]*scheduleMidnightRefresh\(context\)[\s\S]*pending\.finish\(\)/
      );
      expect(actions.has('missing')).toBe(false);
    });

    it('re-renders all widget instances on ACTION_LOCALE_CHANGED', () => {
      // Out-of-app App Language changes (Android Settings) must refresh the
      // widgets without the app foregrounding. Every receiver reacts to the
      // manifest-registered LOCALE_CHANGED broadcast and calls updateAll.
      for (const template of [
        'CalorieWidgetReceiver.kt.tmpl',
        'MacroWidgetReceiver.kt.tmpl',
        'WaterWidgetReceiver.kt.tmpl',
      ]) {
        const src = fs.readFileSync(path.join(KOTLIN_ROOT, template), 'utf8');
        expect(src).toMatch(/Intent\.ACTION_LOCALE_CHANGED/);
        expect(src).toMatch(/glanceAppWidget\.updateAll\(context\)/);
      }
    });
  });

  describe('widget provider contract (no resize)', () => {
    // The pre-localization widgets (22415819) define the base visual language.
    // Localization must not change the default footprint or composition: the
    // classic 2x1 calorie card and 2x2 macro card stay fixed and are NOT
    // resizable. This PR removed the resize/responsive experiment entirely.
    it('keeps resizeMode="none" on every provider XML', () => {
      for (const infoXml of WIDGET_INFO_XMLS) {
        const src = fs.readFileSync(
          path.join(RES_ROOT, 'xml', infoXml),
          'utf8'
        );
        expect(src).toMatch(/android:resizeMode="none"/);
      }
    });

    it('never re-enables horizontal or vertical resizing', () => {
      for (const infoXml of WIDGET_INFO_XMLS) {
        const src = fs.readFileSync(
          path.join(RES_ROOT, 'xml', infoXml),
          'utf8'
        );
        expect(src).not.toMatch(/resizeMode="horizontal\|vertical"/);
        expect(src).not.toMatch(/minResizeWidth/);
        expect(src).not.toMatch(/minResizeHeight/);
      }
    });

    it('keeps the classic provider footprints (calorie 110x40 2x1, macro and water 110x110 2x2)', () => {
      const calorie = fs.readFileSync(
        path.join(RES_ROOT, 'xml', 'sparky_calorie_widget_info.xml'),
        'utf8'
      );
      const macro = fs.readFileSync(
        path.join(RES_ROOT, 'xml', 'sparky_macro_widget_info.xml'),
        'utf8'
      );

      // Calorie: classic 2x1 footprint with the pre-localization minimums.
      expect(calorie).toMatch(/android:minWidth="110dp"/);
      expect(calorie).toMatch(/android:minHeight="40dp"/);
      expect(calorie).toMatch(/android:targetCellWidth="2"/);
      expect(calorie).toMatch(/android:targetCellHeight="1"/);

      // Macro and water: classic 2x2 footprint.
      const water = fs.readFileSync(
        path.join(RES_ROOT, 'xml', 'sparky_water_widget_info.xml'),
        'utf8'
      );
      for (const square of [macro, water]) {
        expect(square).toMatch(/android:minWidth="110dp"/);
        expect(square).toMatch(/android:minHeight="110dp"/);
        expect(square).toMatch(/android:targetCellWidth="2"/);
        expect(square).toMatch(/android:targetCellHeight="2"/);
      }
    });

    it('registers every widget receiver for APPWIDGET_UPDATE and LOCALE_CHANGED', () => {
      // The config plugin declares the receiver intent-filter in the manifest.
      // LOCALE_CHANGED is an explicit exemption from the Android 8+ implicit
      // broadcast limits and covers per-app locale changes, so widgets can
      // re-render when the app language is changed outside the app.
      const pluginSrc = fs.readFileSync(
        path.join(__dirname, '../../plugins/withCalorieWidget.ts'),
        'utf8'
      );
      expect(pluginSrc).toMatch(/android\.appwidget\.action\.APPWIDGET_UPDATE/);
      expect(pluginSrc).toMatch(/android\.intent\.action\.LOCALE_CHANGED/);
      // Keep widget receivers private to external applications. Android system
      // broadcasts remain deliverable to non-exported manifest receivers.
      expect(pluginSrc).toMatch(/'android:exported': 'false'/);
      expect(pluginSrc).toMatch(/for \(const receiver of WIDGET_RECEIVERS\)/);
      for (const receiver of [
        'CalorieWidgetReceiver',
        'MacroWidgetReceiver',
        'WaterWidgetReceiver',
      ]) {
        expect(pluginSrc).toContain(`\${WIDGET_PACKAGE}.${receiver}\``);
      }
      expect(pluginSrc).toContain("'@xml/sparky_water_widget_info'");
      expect(pluginSrc).not.toMatch(/'android:exported': 'true'/);
    });

    it('restores the classic macro size mode (single 200x200 responsive size)', () => {
      // The pre-localization SizeMode: one responsive size matching the fixed
      // 2x2 footprint — NOT resizable, NOT SizeMode.Exact. The water widget
      // shares the footprint.
      for (const template of ['MacroWidget.kt.tmpl', 'WaterWidget.kt.tmpl']) {
        const src = fs.readFileSync(path.join(KOTLIN_ROOT, template), 'utf8');
        expect(src).toMatch(
          /SizeMode\.Responsive\(\s*setOf\(DpSize\(200\.dp, 200\.dp\)\),?\s*\)/
        );
      }
    });

    it('never uses SizeMode.Exact, LocalSize.current or size-driven logic in the Glance widgets', () => {
      for (const template of [
        'CalorieWidget.kt.tmpl',
        'MacroWidget.kt.tmpl',
        'WaterWidget.kt.tmpl',
      ]) {
        const src = fs.readFileSync(path.join(KOTLIN_ROOT, template), 'utf8');
        expect(src).not.toMatch(/import androidx\.glance\.LocalSize/);
        expect(src).not.toMatch(/LocalSize\.current/);
        expect(src).not.toMatch(/SizeMode\.Exact/);
        expect(src).not.toMatch(/size\.width/);
        expect(src).not.toMatch(/size\.height/);
        expect(src).not.toMatch(/showActions/);
        expect(src).not.toMatch(/headingFontSize/);
        expect(src).not.toMatch(/wide/);
      }
    });

    it('keeps the classic calorie composition (one-line heading, progress, actions)', () => {
      const src = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'CalorieWidget.kt.tmpl'),
        'utf8'
      );
      // Classic structure: 12dp padding, one-line bold 18sp heading, 8dp gap +
      // 8dp progress, flexible spacer, then the 32dp action row with 24dp
      // icons and a 24dp divider.
      expect(src).toMatch(/\.padding\(12\.dp\)/);
      expect(src).toMatch(/fontSize = 18\.sp/);
      expect(src).toMatch(/maxLines = 1/);
      expect(src).toMatch(/\.height\(8\.dp\)/);
      expect(src).toMatch(/GlanceModifier\.defaultWeight\(\)/);
      expect(src).toMatch(/\.height\(32\.dp\)/);
      expect(src).toMatch(/\.size\(24\.dp\)/);
      expect(src).toMatch(/\.height\(24\.dp\)/);
      // Actions are always part of the classic default; no height-based hiding.
      expect(src).toMatch(/R\.drawable\.ic_widget_search/);
      expect(src).toMatch(/R\.drawable\.ic_widget_scan/);
    });

    it('keeps the classic macro composition (centered content block, inline rows, actions)', () => {
      const src = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'MacroWidget.kt.tmpl'),
        'utf8'
      );
      // Classic container strategy: Box centers a CONTENT-SIZED column.
      expect(src).toMatch(/contentAlignment = Alignment\.Center/);
      expect(src).toMatch(
        /Column\(modifier = GlanceModifier\.fillMaxWidth\(\)\)/
      );
      expect(src).not.toMatch(
        /Column\(modifier = GlanceModifier\.fillMaxSize\(\)\)/
      );
      // The kcal header and all macro rows are always rendered.
      expect(src).toMatch(/CalorieHeader\(/);
      expect(src).toMatch(/MacroRows\(/);
      // Rows stay inline: colored dot + label + value on one line.
      expect(src).toMatch(/R\.string\.widget_grams/);
      // The action row is always rendered in the classic footprint.
      expect(src).toMatch(/R\.drawable\.ic_widget_search/);
      expect(src).toMatch(/R\.drawable\.ic_widget_scan/);
      expect(src).toMatch(/\.height\(40\.dp\)/);
      expect(src).not.toMatch(/if \(showActions\)/);
    });
  });

  describe('widget locale override contract', () => {
    it('owns the widget locale and render cache in a dedicated SharedPreferences namespace', () => {
      const src = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WidgetLocale.kt.tmpl'),
        'utf8'
      );
      expect(src).toMatch(/PREFS_NAME = "SparkyWidgetLocale"/);
      expect(src).toMatch(/KEY_LOCALE = "widgetLocale"/);
      expect(src).toMatch(
        /KEY_EFFECTIVE_RENDER_LOCALE = "effectiveRenderLocale"/
      );
      expect(src).toMatch(
        /getSharedPreferences\(PREFS_NAME, Context\.MODE_PRIVATE\)/
      );
      expect(src).toMatch(/LOCALE_RENDER_REVISION_STATE_KEY/);
      expect(src).toMatch(/longPreferencesKey\(\"localeRenderRevision\"\)/);
      expect(src).toMatch(/updateAppWidgetState\(context, glanceId\)/);
      expect(src).toMatch(/previous \+ 1L/);
      expect(src).not.toMatch(/System\.currentTimeMillis|System\.nanoTime/);
      expect(src).toMatch(/synchronized rendering cache/);
      expect(src).toMatch(/not a user preference or locale authority/);
    });

    it('prepares preference and effective language atomically before reload', () => {
      const moduleSrc = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'CalorieWidgetModule.kt.tmpl'),
        'utf8'
      );
      expect(moduleSrc).toMatch(/fun prepareWidgetLocale\(/);
      expect(moduleSrc).toMatch(/preference: String/);
      expect(moduleSrc).toMatch(/effectiveLanguage: String/);
      expect(moduleSrc).toMatch(
        /WidgetLocale\.prepareWidgetLocale\(ctx, preference, effectiveLanguage\)/
      );
      expect(moduleSrc).toMatch(
        /WidgetLocale\.bumpLocaleRenderRevision\(ctx, id\)/
      );
      const prepareIndex = moduleSrc.indexOf(
        'WidgetLocale.prepareWidgetLocale(ctx, preference, effectiveLanguage)'
      );
      const bumpIndex = moduleSrc.indexOf(
        'WidgetLocale.bumpLocaleRenderRevision(ctx, id)',
        prepareIndex
      );
      const resolveIndex = moduleSrc.indexOf(
        'promise.resolve(null)',
        bumpIndex
      );
      expect(prepareIndex).toBeGreaterThan(-1);
      expect(bumpIndex).toBeGreaterThan(prepareIndex);
      expect(resolveIndex).toBeGreaterThan(bumpIndex);
      expect(moduleSrc).toMatch(/var firstFailure: Exception\?/);
      expect(moduleSrc).toMatch(/RuntimeException\([^\n]+, firstFailure\)/);
      expect(moduleSrc).toMatch(
        /catch \(e: CancellationException\)\s*\{\s*throw e/
      );

      const bridge = fs.readFileSync(
        path.join(__dirname, '../../src/services/CalorieWidgetBridge.ts'),
        'utf8'
      );
      expect(bridge).toMatch(/prepareWidgetLocale\(/);
      expect(bridge).toMatch(/effectiveLanguage/);
    });

    it('resolves the render cache before LocaleManager on Android 13+', () => {
      const src = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WidgetLocale.kt.tmpl'),
        'utf8'
      );
      const renderContextIndex = src.indexOf(
        'fun localizedContext(context: Context): Context'
      );
      const cacheIndex = src.indexOf(
        'effectiveRenderLocale(context)',
        renderContextIndex
      );
      const platformIndex = src.indexOf(
        'currentPlatformLanguage(context)',
        renderContextIndex
      );
      expect(renderContextIndex).toBeGreaterThan(-1);
      expect(cacheIndex).toBeGreaterThan(renderContextIndex);
      expect(platformIndex).toBeGreaterThan(cacheIndex);
      expect(src).toMatch(/applicationLocales/);
      expect(src).toMatch(/systemLocales/);
      expect(src).toMatch(/createConfigurationContext\(config\)/);
      expect(src).not.toMatch(
        /if \(isNativeAppLanguageSupported\(\)\) return context/
      );
    });

    it('keeps API <=32 override behavior and removes the API 33 cache there', () => {
      const src = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WidgetLocale.kt.tmpl'),
        'utf8'
      );
      expect(src).toMatch(/override\(context\)/);
      expect(src).toMatch(/editor\.remove\(KEY_EFFECTIVE_RENDER_LOCALE\)/);
      expect(src).toMatch(/editor\.remove\(KEY_LOCALE\)/);
      expect(src).toMatch(
        /editor\.putString\(KEY_LOCALE, normalizedPreference\)/
      );
      expect(src).toMatch(/\{\{SUPPORTED_LOCALES\}\}/);
      expect(src).toMatch(/\{\{FALLBACK_LOCALE\}\}/);
    });

    it('refreshes the broadcast locale payload before LOCALE_CHANGED updateAll', () => {
      for (const receiver of [
        'CalorieWidgetReceiver.kt.tmpl',
        'MacroWidgetReceiver.kt.tmpl',
        'WaterWidgetReceiver.kt.tmpl',
      ]) {
        const src = fs.readFileSync(path.join(KOTLIN_ROOT, receiver), 'utf8');
        const refreshIndex = src.indexOf(
          'refreshEffectiveRenderLocaleFromBroadcast(context, intent)'
        );
        const bumpIndex = src.indexOf(
          'WidgetLocale.bumpLocaleRenderRevision(context, id)',
          refreshIndex
        );
        const updateIndex = src.indexOf(
          'glanceAppWidget.updateAll(context)',
          bumpIndex
        );
        expect(refreshIndex).toBeGreaterThan(-1);
        expect(bumpIndex).toBeGreaterThan(refreshIndex);
        expect(updateIndex).toBeGreaterThan(bumpIndex);
        expect(src).toMatch(/GlanceAppWidgetManager\(context\)/);
        expect(src).toMatch(/catch \(e: CancellationException\)/);
        expect(src).toMatch(/throw e/);
        expect(src).toMatch(/catch \(e: Exception\)/);
        expect(src).toMatch(/pending.finish\(\)/);
      }

      const locale = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WidgetLocale.kt.tmpl'),
        'utf8'
      );
      expect(locale).toMatch(/Intent\.EXTRA_PACKAGE_NAME/);
      expect(locale).toMatch(/Intent\.EXTRA_LOCALE_LIST/);
      // The API 33+ getParcelableExtra(String, Class<T>) overload is isolated
      // in WidgetLocaleApi33 (issue #2253); the common WidgetLocale object only
      // delegates to it.
      expect(locale).toMatch(/WidgetLocaleApi33\.getLocaleListExtra\(intent\)/);
      expect(locale).not.toMatch(
        /getParcelableExtra\(\s*Intent\.EXTRA_LOCALE_LIST,\s*LocaleList::class\.java,?\s*\)/
      );
      expect(locale).toMatch(/systemPlatformLanguage\(context\)/);
      expect(locale).toMatch(/refreshEffectiveRenderLocaleFromBroadcast/);
      expect(locale).not.toMatch(/refreshEffectiveRenderLocaleFromPlatform/);
      // The app-locale payload is the primary path. A stale
      // applicationLocales readback may only remain in the non-app fallback.
      const broadcastStart = locale.indexOf(
        'fun refreshEffectiveRenderLocaleFromBroadcast'
      );
      const broadcastEnd = locale.indexOf(
        '/** Reads only the API 33+ synchronized rendering cache. */',
        broadcastStart
      );
      const broadcastBody = locale.slice(broadcastStart, broadcastEnd);
      const appBranchStart = broadcastBody.indexOf(
        'val effective = if (hasAppLocaleExtras) {'
      );
      const appBranchEnd = broadcastBody.indexOf(
        '        } else {\n            val contextLocales',
        appBranchStart
      );
      const appPayloadBranch = broadcastBody.slice(
        appBranchStart,
        appBranchEnd
      );
      expect(appBranchStart).toBeGreaterThan(-1);
      expect(appBranchEnd).toBeGreaterThan(appBranchStart);
      expect(appPayloadBranch).not.toMatch(
        /currentPlatformLanguage\(context\)/
      );
      expect(appPayloadBranch).toMatch(
        /appLocales != null && !appLocales\.isEmpty/
      );
      expect(appPayloadBranch).toMatch(/languageFromLocaleList\(appLocales\)/);
      expect(broadcastBody).toMatch(/systemPlatformLanguage\(context\)/);
      expect(broadcastBody).toMatch(
        /editor\.putString\(KEY_EFFECTIVE_RENDER_LOCALE, effective\)/
      );

      // The API 33+ overload must live in the isolated helper (issue #2253).
      const helper = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'WidgetLocaleApi33.kt.tmpl'),
        'utf8'
      );
      expect(helper).toMatch(
        /getParcelableExtra\(\s*Intent\.EXTRA_LOCALE_LIST,\s*LocaleList::class\.java,?\s*\)/
      );
    });

    it('exposes prepareWidgetLocale through the native bridge', () => {
      const moduleSrc = fs.readFileSync(
        path.join(KOTLIN_ROOT, 'CalorieWidgetModule.kt.tmpl'),
        'utf8'
      );
      expect(moduleSrc).toMatch(/fun prepareWidgetLocale\(/);
      expect(moduleSrc).toMatch(
        /WidgetLocale\.prepareWidgetLocale\(ctx, preference, effectiveLanguage\)/
      );
    });

    it('makes every active widget composition observe the locale revision state', () => {
      for (const template of [
        'CalorieWidget.kt.tmpl',
        'MacroWidget.kt.tmpl',
        'WaterWidget.kt.tmpl',
      ]) {
        const src = fs.readFileSync(path.join(KOTLIN_ROOT, template), 'utf8');
        expect(src).toMatch(/currentState<Preferences>\(\)/);
        expect(src).toMatch(
          /currentState\(WidgetLocale\.LOCALE_RENDER_REVISION_STATE_KEY\)/
        );
        expect(src).not.toMatch(
          /state\[WidgetLocale\.LOCALE_RENDER_REVISION_STATE_KEY\]/
        );
      }
    });
  });

  describe('widget picker metadata', () => {
    it('uses resource labels and descriptions in the receiver info XML', () => {
      const calorieInfo = fs.readFileSync(
        path.join(RES_ROOT, 'xml', 'sparky_calorie_widget_info.xml'),
        'utf8'
      );
      const macroInfo = fs.readFileSync(
        path.join(RES_ROOT, 'xml', 'sparky_macro_widget_info.xml'),
        'utf8'
      );

      const waterInfo = fs.readFileSync(
        path.join(RES_ROOT, 'xml', 'sparky_water_widget_info.xml'),
        'utf8'
      );

      expect(calorieInfo).toContain('@string/sparky_widget_description');
      expect(macroInfo).toContain('@string/sparky_macro_widget_description');
      expect(waterInfo).toContain('@string/sparky_water_widget_description');
    });
  });

  describe('preview layouts', () => {
    it('references localized strings instead of hardcoded English text', () => {
      for (const layout of [
        'sparky_widget_initial_layout.xml',
        'sparky_macro_widget_initial_layout.xml',
        'sparky_water_widget_initial_layout.xml',
      ]) {
        const src = fs.readFileSync(
          path.join(RES_ROOT, 'layout', layout),
          'utf8'
        );
        const textValues = [...src.matchAll(/android:text="([^"]*)"/g)].map(
          (m) => m[1]
        );
        const contentDescriptions = [
          ...src.matchAll(/android:contentDescription="([^"]*)"/g),
        ].map((m) => m[1]);

        for (const value of [...textValues, ...contentDescriptions]) {
          if (value === '') continue;
          expect(value).toMatch(/^@string\//);
          expect(value).not.toMatch(/^@string\/(?!widget_)/);
        }
      }
    });

    it('reuses localized labels for macros and grams samples', () => {
      const macroLayout = fs.readFileSync(
        path.join(RES_ROOT, 'layout', 'sparky_macro_widget_initial_layout.xml'),
        'utf8'
      );
      expect(macroLayout).toContain('@string/widget_protein');
      expect(macroLayout).toContain('@string/widget_carbs');
      expect(macroLayout).toContain('@string/widget_fat');
      expect(macroLayout).toContain('@string/widget_preview_grams_protein');
    });

    it('calorie preview mirrors the classic one-line heading', () => {
      const calorieLayout = fs.readFileSync(
        path.join(RES_ROOT, 'layout', 'sparky_widget_initial_layout.xml'),
        'utf8'
      );
      // Classic one-line heading, not the two-line caption/value split.
      expect(calorieLayout).toContain('@string/widget_preview_calories_left');
      expect(calorieLayout).not.toContain('@string/widget_kcal_left_caption');
      expect(calorieLayout).not.toContain(
        '@string/widget_preview_calories_value'
      );
      // Progress + action row present like the classic default.
      expect(calorieLayout).toContain('@string/widget_search_food');
      expect(calorieLayout).toContain('@string/widget_scan_barcode');
    });

    it('macro preview mirrors the classic one-line header and inline rows', () => {
      const macroLayout = fs.readFileSync(
        path.join(RES_ROOT, 'layout', 'sparky_macro_widget_initial_layout.xml'),
        'utf8'
      );
      // One-line kcal header (no caption/value split).
      expect(macroLayout).toContain('@string/widget_preview_macros_left');
      expect(macroLayout).not.toContain('@string/widget_kcal_left_caption');
      expect(macroLayout).not.toContain('@string/widget_preview_macros_value');
      // Inline rows: label and gram value live in the SAME row.
      const carbsIndex = macroLayout.indexOf('@string/widget_carbs');
      const gramsCarbsIndex = macroLayout.indexOf(
        '@string/widget_preview_grams_carbs'
      );
      expect(carbsIndex).toBeGreaterThan(-1);
      expect(gramsCarbsIndex).toBeGreaterThan(carbsIndex);
      expect(gramsCarbsIndex - carbsIndex).toBeLessThan(900);
    });
  });
});
