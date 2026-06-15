import { useCallback, useEffect, useRef, useState } from 'react';
import { addDays, getTodayDate } from '../utils/dateUtils';
import { useMoodEntryByDate, useSaveMoodMutation } from './useMood';

const DEFAULT_MOOD = 50;

/**
 * Owns the check-in screen's mutable state (selected date + mood form) and
 * derives the mood form from the saved entry for the date. Mirrors the web
 * `useCheckInLogic` "derived state" pattern: the form follows the server value
 * until the user edits it, after which their input is preserved for that date.
 */
export function useCheckInScreen(initialDate?: string, enabled: boolean = true) {
  const [selectedDate, setSelectedDate] = useState(
    initialDate ?? getTodayDate(),
  );
  const [mood, setMoodState] = useState<number>(DEFAULT_MOOD);
  const [moodNotes, setMoodNotesState] = useState<string>('');

  // Once the user edits mood for the current date we stop syncing it from the
  // refetched entry, so a background refresh can't clobber their input.
  const touchedRef = useRef(false);
  const lastSyncedDateRef = useRef<string | null>(null);

  const { mood: existingMood, isLoading: isMoodLoading } = useMoodEntryByDate(
    selectedDate,
    enabled,
  );
  const saveMoodMutation = useSaveMoodMutation();

  useEffect(() => {
    if (lastSyncedDateRef.current !== selectedDate) {
      lastSyncedDateRef.current = selectedDate;
      touchedRef.current = false;
    }
    if (touchedRef.current) return;
    setMoodState(existingMood?.mood_value ?? DEFAULT_MOOD);
    setMoodNotesState(existingMood?.notes ?? '');
  }, [selectedDate, existingMood]);

  const setMood = useCallback((value: number) => {
    touchedRef.current = true;
    setMoodState(value);
  }, []);

  const setMoodNotes = useCallback((value: string) => {
    touchedRef.current = true;
    setMoodNotesState(value);
  }, []);

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const goToPreviousDay = useCallback(
    () => setSelectedDate((prev) => addDays(prev, -1)),
    [],
  );
  const goToNextDay = useCallback(
    () => setSelectedDate((prev) => addDays(prev, 1)),
    [],
  );
  const goToToday = useCallback(() => setSelectedDate(getTodayDate()), []);

  const handleSaveMood = useCallback(() => {
    saveMoodMutation.mutate(
      { moodValue: mood, notes: moodNotes, entryDate: selectedDate },
      {
        onSuccess: () => {
          // Re-derive from the saved value on the next refetch.
          touchedRef.current = false;
        },
      },
    );
  }, [saveMoodMutation, mood, moodNotes, selectedDate]);

  return {
    selectedDate,
    setSelectedDate: handleDateChange,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    mood,
    moodNotes,
    setMood,
    setMoodNotes,
    handleSaveMood,
    isSavingMood: saveMoodMutation.isPending,
    isMoodLoading,
  };
}
