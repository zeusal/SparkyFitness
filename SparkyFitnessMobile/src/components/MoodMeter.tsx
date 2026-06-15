import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  PanResponder,
  type LayoutChangeEvent,
  type GestureResponderEvent,
} from 'react-native';
import { useCSSVariable } from 'uniwind';
import FormInput from './FormInput';

interface MoodMeterProps {
  mood: number;
  notes: string;
  onMoodChange: (value: number) => void;
  onNotesChange: (value: string) => void;
}

const MIN = 10;
const MAX = 100;
const STEP = 10;
const THUMB = 28;

// Mirrors the web MoodMeter thresholds so the emoji/label match across clients.
const getMoodDisplay = (value: number): { emoji: string; label: string } => {
  if (value <= 10) return { emoji: '😴', label: 'Tired' };
  if (value <= 20) return { emoji: '😢', label: 'Sad' };
  if (value <= 30) return { emoji: '😠', label: 'Angry' };
  if (value <= 40) return { emoji: '😟', label: 'Worried' };
  if (value <= 50) return { emoji: '😐', label: 'Neutral' };
  if (value <= 60) return { emoji: '🤔', label: 'Thoughtful' };
  if (value <= 70) return { emoji: '🙂', label: 'Calm' };
  if (value <= 80) return { emoji: '😎', label: 'Confident' };
  if (value <= 90) return { emoji: '😀', label: 'Happy' };
  return { emoji: '😍', label: 'Excited' };
};

const snap = (raw: number): number => {
  const clamped = Math.max(MIN, Math.min(MAX, raw));
  return Math.round(clamped / STEP) * STEP;
};

const MoodMeter: React.FC<MoodMeterProps> = ({
  mood,
  notes,
  onMoodChange,
  onNotesChange,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);
  const [accentPrimary, raisedBg, borderSubtle] = useCSSVariable([
    '--color-accent-primary',
    '--color-raised',
    '--color-border-subtle',
  ]) as [string, string, string];

  const display = getMoodDisplay(mood);
  const ratio = (mood - MIN) / (MAX - MIN);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    trackWidthRef.current = w;
    setTrackWidth(w);
  };

  const updateFromX = (x: number) => {
    const w = trackWidthRef.current;
    if (w <= 0) return;
    const r = Math.max(0, Math.min(1, x / w));
    onMoodChange(snap(MIN + r * (MAX - MIN)));
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e: GestureResponderEvent) =>
          updateFromX(e.nativeEvent.locationX),
        onPanResponderMove: (e: GestureResponderEvent) =>
          updateFromX(e.nativeEvent.locationX),
      }),
    // updateFromX reads refs/props via closure; recreate when handler identity
    // changes is unnecessary — PanResponder is created once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const thumbLeft = Math.max(
    0,
    Math.min(trackWidth - THUMB, ratio * trackWidth - THUMB / 2),
  );

  return (
    <View className="bg-surface rounded-xl p-4 mb-3 shadow-sm">
      <Text className="text-md font-bold text-text-primary mb-3">
        How are you feeling today?
      </Text>

      <View className="flex-row items-center mb-3">
        <Text style={{ fontSize: 36 }}>{display.emoji}</Text>
        <View
          className="flex-1 ml-4 justify-center"
          style={{ height: THUMB }}
          onLayout={handleLayout}
          {...panResponder.panHandlers}
        >
          {/* Track */}
          <View
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: borderSubtle,
            }}
          >
            {/* Filled portion */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${ratio * 100}%`,
                borderRadius: 3,
                backgroundColor: accentPrimary,
              }}
            />
          </View>
          {/* Thumb */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: thumbLeft,
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: raisedBg,
              borderWidth: 2,
              borderColor: accentPrimary,
            }}
          />
        </View>
      </View>

      <Text className="text-center text-lg font-semibold text-text-primary mb-4">
        {display.label}
      </Text>

      <Text className="text-text-secondary text-sm mb-1">Notes (optional)</Text>
      <FormInput
        value={notes}
        onChangeText={onNotesChange}
        placeholder="Any thoughts or feelings you'd like to add?"
        multiline
        numberOfLines={3}
        style={{ minHeight: 72, textAlignVertical: 'top' }}
      />
    </View>
  );
};

export default MoodMeter;
