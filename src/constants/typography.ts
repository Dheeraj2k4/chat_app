import { TextStyle } from 'react-native';

// Font family — load via expo-google-fonts/poppins or @expo-google-fonts/poppins
export const FontFamily = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

// Font sizes
export const FontSize = {
  heading: 24,    // Screen titles, chat header name
  subtitle: 16,   // Section headers, contact names in list
  body: 14,       // Standard message body
  caption: 12,    // Timestamps, message previews, muted text
};

// Line heights (1.4× rule for readability)
export const LineHeight = {
  heading: 32,
  subtitle: 24,
  body: 20,
  caption: 18,
};

// Letter spacing
export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
};

// Pre-composed text styles
const Typography = {
  heading: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.heading,
    lineHeight: LineHeight.heading,
    letterSpacing: LetterSpacing.tight,
  } as TextStyle,

  subtitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.subtitle,
    lineHeight: LineHeight.subtitle,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,

  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.body,
    lineHeight: LineHeight.body,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,

  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
    letterSpacing: LetterSpacing.normal,
  } as TextStyle,

  // Variants
  captionMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.caption,
    lineHeight: LineHeight.caption,
  } as TextStyle,

  subtitleMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.subtitle,
    lineHeight: LineHeight.subtitle,
  } as TextStyle,
};

export default Typography;
