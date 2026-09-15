import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';

import { initials } from '../lib/format';
import { colors, fonts } from '../theme/tokens';

type AvatarProps = {
  name: string;
  photoUri: string | null;
  size?: number;
};

export function Avatar({ name, photoUri, size = 44 }: AvatarProps) {
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (photoUri) {
    return <Image source={{ uri: photoUri }} style={[shape, styles.border]} accessibilityIgnoresInvertColors />;
  }

  return (
    <View style={[shape, styles.border, styles.clip]}>
      <LinearGradient colors={[colors.primary, colors.surfaceHighlight]} style={StyleSheet.absoluteFill} />
      <Text style={[styles.initials, { fontSize: size * 0.42, lineHeight: size * 0.52 }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  clip: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.serif,
    color: colors.text,
    letterSpacing: -0.5,
  },
});
