import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants';
import Typography from '../constants/typography';

export default function BookmarksScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.icon}>🔖</Text>
        <Text style={styles.label}>Bookmarks</Text>
        <Text style={styles.sub}>Saved messages will appear here</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  icon: { fontSize: 48 },
  label: { ...Typography.subtitle, color: Colors.textPrimary },
  sub: { ...Typography.caption, color: Colors.textSecondary },
});
