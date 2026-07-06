import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Device size classifications
export const DeviceSize = {
  isSmallPhone: width < 375, // iPhone SE, iPhone 8
  isPhone: width >= 375 && width < 500, // Standard phones
  isLargePhone: width >= 500 && width < 768, // Large phones
  isTablet: width >= 768, // Tablets
};

// Responsive font sizes
export const FontSize = {
  xs: width < 375 ? 11 : 12,
  sm: width < 375 ? 12 : 13,
  base: width < 375 ? 14 : 15,
  lg: width < 375 ? 16 : 17,
  xl: width < 375 ? 18 : 20,
  '2xl': width < 375 ? 20 : 24,
  '3xl': width < 375 ? 24 : 30,
  '4xl': width < 375 ? 28 : 36,
};

// Responsive spacing
export const Spacing = {
  xs: width < 375 ? 4 : 6,
  sm: width < 375 ? 8 : 10,
  md: width < 375 ? 12 : 16,
  lg: width < 375 ? 16 : 20,
  xl: width < 375 ? 20 : 24,
  '2xl': width < 375 ? 24 : 32,
};

// Responsive dimensions
export const ResponsiveDimensions = {
  screenWidth: width,
  screenHeight: height,
  contentWidth: DeviceSize.isTablet
    ? Math.min(width * 0.7, 600)
    : width - Spacing.md * 2,
  cardWidth: DeviceSize.isTablet
    ? Math.min(width * 0.6, 500)
    : width - Spacing.md * 2,
  buttonHeight: width < 375 ? 44 : 48,
  inputHeight: width < 375 ? 40 : 44,
  iconSize: width < 375 ? 20 : 24,
  largeIconSize: width < 375 ? 40 : 50,
};

// Safe area-aware dimensions
export const SafeAreaDimensions = {
  statusBarHeight: Platform.OS === 'android' ? 0 : 44,
  navBarHeight: 56,
  get contentAreaHeight() {
    return height - this.statusBarHeight - this.navBarHeight;
  },
};

// Responsive line height
export const LineHeight = {
  xs: width < 375 ? 16 : 18,
  sm: width < 375 ? 18 : 20,
  base: width < 375 ? 20 : 24,
  lg: width < 375 ? 24 : 28,
  xl: width < 375 ? 28 : 32,
  '2xl': width < 375 ? 32 : 36,
};
