import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>??</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    height: 44,
    marginLeft: Spacing.lg,
    flex: 1,
  },
  icon: {
    fontSize: 15,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    padding: 0,
  },
});
