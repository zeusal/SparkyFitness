import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';
import Icon from '../components/Icon';
import Button from '../components/ui/Button';
import CalendarSheet, { type CalendarSheetRef } from '../components/CalendarSheet';
import MoodMeter from '../components/MoodMeter';
import SleepEntryForm from '../components/SleepEntryForm';
import CheckInPhotoGrid from '../components/CheckInPhotoGrid';
import RecentActivityList from '../components/RecentActivityList';
import { useCheckInScreen } from '../hooks/useCheckInScreen';
import { useServerConnection } from '../hooks';
import { formatDateLabel } from '../utils/dateUtils';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'CheckIn'>;

const CheckInScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const calendarRef = useRef<CalendarSheetRef>(null);

  const [accentPrimary, secondaryTextColor, borderSubtle] = useCSSVariable([
    '--color-accent-primary',
    '--color-text-secondary',
    '--color-border-subtle',
  ]) as [string, string, string];

  const { isConnected } = useServerConnection();
  const {
    selectedDate,
    setSelectedDate,
    goToPreviousDay,
    goToNextDay,
    mood,
    moodNotes,
    setMood,
    setMoodNotes,
    handleSaveMood,
    isSavingMood,
  } = useCheckInScreen(route.params?.date, isConnected);

  const openCalendar = useCallback(() => calendarRef.current?.present(), []);

  return (
    <View
      className="flex-1 bg-background"
      style={Platform.OS === 'android' ? { paddingTop: insets.top } : undefined}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border-subtle">
        <Button
          variant="ghost"
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="z-10 p-0"
          accessibilityLabel="Close"
        >
          <Icon name="close" size={22} color={accentPrimary} />
        </Button>
        <Text className="absolute left-0 right-0 text-center text-text-primary text-lg font-semibold">
          Daily Check-In
        </Text>
      </View>

      {/* Date selector */}
      <View
        className="flex-row items-center justify-center py-3 border-b"
        style={{ borderBottomColor: borderSubtle }}
      >
        <TouchableOpacity onPress={goToPreviousDay} className="p-2">
          <Icon name="chevron-back" size={18} color={secondaryTextColor} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openCalendar}
          className="flex-row items-center px-3"
        >
          <Text className="text-text-primary text-base font-medium">
            {formatDateLabel(selectedDate)}
          </Text>
          <Icon
            name="chevron-down"
            size={13}
            color={accentPrimary}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextDay} className="p-2">
          <Icon name="chevron-forward" size={18} color={secondaryTextColor} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        contentContainerClassName="px-4 py-4"
        bottomOffset={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <MoodMeter
          mood={mood}
          notes={moodNotes}
          onMoodChange={setMood}
          onNotesChange={setMoodNotes}
        />
        <Button
          variant="primary"
          onPress={handleSaveMood}
          disabled={isSavingMood}
          className="py-3 mb-4 -mt-1"
        >
          {isSavingMood ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-sm font-semibold text-white">Save mood</Text>
          )}
        </Button>

        <SleepEntryForm selectedDate={selectedDate} enabled={isConnected} />

        {/* Measurements: reuse the existing dedicated screen */}
        <Button
          variant="secondary"
          onPress={() =>
            navigation.navigate('MeasurementsAdd', { date: selectedDate })
          }
          className="py-3 mb-3 flex-row items-center justify-center"
        >
          <Icon name="measurements" size={18} color={accentPrimary} />
          <Text className="text-sm font-semibold text-text-primary ml-2">
            Add Measurements
          </Text>
        </Button>

        <CheckInPhotoGrid selectedDate={selectedDate} enabled={isConnected} />

        <RecentActivityList enabled={isConnected} />

        <View style={{ height: insets.bottom + 24 }} />
      </KeyboardAwareScrollView>

      <CalendarSheet
        ref={calendarRef}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
    </View>
  );
};

export default CheckInScreen;
