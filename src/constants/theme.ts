import Colors from './colors';
import Typography, { FontFamily, FontSize, LineHeight } from './typography';

// Spacing scale (4pt base grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// Border radii
export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,   // Pill / circle
};

// Shadows (Android elevation + iOS shadow)
export const Shadow = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Bottom tab bar
export const TabBar = {
  height: 64,
  iconSize: 24,
  activeColor: Colors.iconActive,
  inactiveColor: Colors.icon,
  backgroundColor: Colors.white,
};

// Header / navigation bar
export const Header = {
  height: 56,
  backgroundColor: Colors.white,
  titleStyle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
  },
  backIconColor: Colors.textPrimary,
  actionIconColor: Colors.icon,
};

// Avatar sizes
export const AvatarSize = {
  sm: 36,
  md: 48,
  lg: 56,
};

// Chat message bubbles
export const Bubble = {
  maxWidthRatio: 0.72,   // 72% of screen width
  paddingH: Spacing.md,
  paddingV: Spacing.sm,
  radiusIncoming: {
    borderTopLeftRadius: Radius.sm,
    borderTopRightRadius: Radius.lg,
    borderBottomLeftRadius: Radius.xs,
    borderBottomRightRadius: Radius.lg,
  },
  radiusOutgoing: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.sm,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.xs,
  },
};

// FAB (Floating Action Button)
export const FAB = {
  size: 56,
  backgroundColor: Colors.primary,
  iconColor: Colors.white,
  borderRadius: Radius.full,
  ...Shadow.md,
};

// Input / search bar
export const Input = {
  height: 44,
  borderRadius: Radius.full,
  backgroundColor: Colors.surface,
  paddingH: Spacing.lg,
  placeholderColor: Colors.textMuted,
  textStyle: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
};

const Theme = {
  Colors,
  Typography,
  FontFamily,
  FontSize,
  LineHeight,
  Spacing,
  Radius,
  Shadow,
  TabBar,
  Header,
  AvatarSize,
  Bubble,
  FAB,
  Input,
};

export default Theme;
