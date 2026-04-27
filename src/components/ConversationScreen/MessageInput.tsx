import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { Colors } from '../../constants';
import { useTheme } from '../../store/ThemeContext';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing, Radius, Shadow } from '../../constants/theme';

interface Props {
  onSend: (text?: string, imageUri?: string, fileName?: string) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export default function MessageInput({ onSend }: Props) {
  const { colors } = useTheme();
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleAttachment = async () => {
    Alert.alert('Attachment', 'Choose an option', [
      {
        text: 'Photo Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission needed', 'Allow photo access to send images.'); return; }
          const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
          if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
              Alert.alert('File too large', 'Please choose an image under 50 MB.');
              return;
            }
            onSend(undefined, asset.uri, asset.uri.split('/').pop() ?? 'photo.jpg');
          }
        },
      },
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') { Alert.alert('Permission needed', 'Allow camera access to take photos.'); return; }
          const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
          if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
              Alert.alert('File too large', 'Photo exceeds the 50 MB limit.');
              return;
            }
            onSend(undefined, asset.uri, asset.uri.split('/').pop() ?? 'photo.jpg');
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const canSend = text.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary }]}
        value={text}
        onChangeText={setText}
        placeholder="Message..."
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={2000}
      />
      <Pressable style={styles.actionBtn} onPress={canSend ? handleSend : handleAttachment} hitSlop={8}>
        {canSend
          ? <Entypo name="paper-plane" size={22} color={Colors.white} />
          : <Ionicons name="add" size={26} color={Colors.white} />
        }
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#1A1A1A',
    maxHeight: 120,
    minHeight: 44,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
