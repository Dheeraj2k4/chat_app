import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants';
import { FontFamily } from '../../constants/typography';

interface AvatarProps {
  name: string;
  initials: string;
  avatarColor: string;
  size?: number;
  showOnline?: boolean;
  isOnline?: boolean;
  ringColor?: string; // coloured story-ring when provided
}

export default function Avatar({
  initials,
  avatarColor,
  size = 48,
  showOnline = false,
  isOnline = false,
  ringColor,
}: AvatarProps) {
  const fontSize = size * 0.33;
  const ringWidth = 2.5;
  const ringGap = 2;
  const outerSize = ringColor ? size + (ringWidth + ringGap) * 2 : size;

  return (
    <View style={{ width: outerSize, height: outerSize, alignItems: 'center', justifyContent: 'center' }}>
      {/* Coloured ring */}
      {ringColor && (
        <View
          style={{
            position: 'absolute',
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            borderWidth: ringWidth,
            borderColor: ringColor,
          }}
        />
      )}

      {/* Avatar circle */}
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: avatarColor },
        ]}
      >
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      </View>

      {/* Online dot */}
      {showOnline && (
        <View
          style={[
            styles.dot,
            {
              width: size * 0.27,
              height: size * 0.27,
              borderRadius: (size * 0.27) / 2,
              backgroundColor: isOnline ? '#2ECC71' : Colors.border,
              bottom: ringColor ? ringWidth + ringGap - 1 : 0,
              right: ringColor ? ringWidth + ringGap - 1 : 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    letterSpacing: 0.5,
  },
  dot: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});
