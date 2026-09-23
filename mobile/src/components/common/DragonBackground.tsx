import React from 'react';
import { StyleSheet, ImageBackground, View, ViewStyle, StyleProp } from 'react-native';

interface DragonBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  overlayOpacity?: number; // 0 (fully visible image) to 1 (solid dark)
}

// Reusable Dragon background container with midnight blue dark tint
export const DragonBackground: React.FC<DragonBackgroundProps> = ({
  children,
  style,
  overlayOpacity = 0.85,
}) => {
  return (
    <ImageBackground
      source={require('../../assets/images/dragon_bg.jpg')}
      style={[styles.background, style]}
      resizeMode="cover"
    >
      <View
        style={[
          styles.overlay,
          { backgroundColor: `rgba(7, 15, 30, ${overlayOpacity})` },
        ]}
      >
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
});
