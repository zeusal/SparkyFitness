jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: '1.0.0',
      extra: { iosAppGroup: 'group.test.sparkyfitness' },
    },
  },
}));

import { Platform } from 'react-native';

import { ExtensionStorage } from '@bacons/apple-targets';
import { CalorieWidgetBridge } from '../../src/services/CalorieWidgetBridge';
import { addLog } from '../../src/services/LogService';
import {
  CALORIE_SNAPSHOT_KEY,
  MACRO_SNAPSHOT_KEY,
  MACRO_WIDGET_KIND,
  WIDGET_KIND,
  clearWidgetSnapshots,
} from '../../src/services/widgetSnapshots';

jest.mock('@bacons/apple-targets', () => {
  const mockRemove = jest.fn();
  const mockReload = jest.fn();

  class ExtensionStorage {
    appGroup: string;
    constructor(group: string) {
      this.appGroup = group;
    }
    remove(key: string) {
      mockRemove(key);
    }
    static reloadWidget(name?: string) {
      mockReload(name);
    }
  }
  (ExtensionStorage as any).__mockRemove = mockRemove;
  (ExtensionStorage as any).__mockReload = mockReload;
  return { ExtensionStorage };
});

jest.mock('../../src/services/CalorieWidgetBridge', () => ({
  CalorieWidgetBridge: {
    setCalorieSnapshot: jest.fn().mockResolvedValue(undefined),
    setMacroSnapshot: jest.fn().mockResolvedValue(undefined),
    reloadWidget: jest.fn().mockResolvedValue(undefined),
    reloadMacroWidget: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../src/services/LogService', () => ({
  addLog: jest.fn(),
}));

const mockRemove = (ExtensionStorage as any).__mockRemove as jest.Mock;
const mockReload = (ExtensionStorage as any).__mockReload as jest.Mock;
const mockBridge = CalorieWidgetBridge as jest.Mocked<
  typeof CalorieWidgetBridge
>;
const mockAddLog = addLog as jest.MockedFunction<typeof addLog>;

describe('clearWidgetSnapshots', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    Platform.OS = 'ios';
  });

  describe('iOS', () => {
    beforeEach(() => {
      Platform.OS = 'ios';
    });

    it('removes both snapshots from the app group and reloads each widget', async () => {
      await clearWidgetSnapshots();

      expect(mockRemove).toHaveBeenCalledWith(CALORIE_SNAPSHOT_KEY);
      expect(mockRemove).toHaveBeenCalledWith(MACRO_SNAPSHOT_KEY);
      // Removing the key alone leaves the rendered widget untouched until the
      // OS next asks for a timeline, so both kinds have to be reloaded.
      expect(mockReload).toHaveBeenCalledWith(WIDGET_KIND);
      expect(mockReload).toHaveBeenCalledWith(MACRO_WIDGET_KIND);
    });

    it('leaves the android bridge alone', async () => {
      await clearWidgetSnapshots();

      expect(mockBridge.setCalorieSnapshot).not.toHaveBeenCalled();
    });
  });

  describe('Android', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    it('writes an unparseable snapshot so the widget falls back to its empty state', async () => {
      await clearWidgetSnapshots();

      // `parseSnapshot` in the Kotlin templates returns null for anything it
      // cannot read as JSON, and null is what renders widget_kcal_left_empty.
      expect(mockBridge.setCalorieSnapshot).toHaveBeenCalledWith('');
      expect(mockBridge.setMacroSnapshot).toHaveBeenCalledWith('');
      expect(mockBridge.reloadWidget).toHaveBeenCalledTimes(1);
      expect(mockBridge.reloadMacroWidget).toHaveBeenCalledTimes(1);
    });

    it('leaves the iOS app group alone', async () => {
      await clearWidgetSnapshots();

      expect(mockRemove).not.toHaveBeenCalled();
    });

    it('reports a failed sweep instead of swallowing it', async () => {
      mockBridge.setCalorieSnapshot.mockRejectedValueOnce(
        new Error('no native module')
      );

      await expect(clearWidgetSnapshots()).resolves.toBeUndefined();

      // A failure here leaves one account's figures on another account's home
      // screen, and nothing retries until the next Dashboard open.
      expect(mockAddLog).toHaveBeenCalledWith(
        expect.stringContaining('widget snapshots'),
        'ERROR'
      );
    });
  });
});
