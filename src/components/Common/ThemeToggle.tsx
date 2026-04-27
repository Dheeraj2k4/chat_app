import React from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';

/**
 * Sun/moon toggle button.
 * Drop it anywhere — it reads and writes to ThemeContext.
 */
export default function ThemeToggle() {
  const { isDark, toggle, colors } = useTheme();

  return (
    <Pressable
      onPress={toggle}
      hitSlop={10}
      style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.border }]}
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      accessibilityRole="button"
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={18}
        color={isDark ? '#F59E0B' : '#F59E0B'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
