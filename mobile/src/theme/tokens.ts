export const colors = {
  background: '#000000',
  surface: '#07040F',
  surfaceRaised: '#0E0820',
  surfaceHighlight: '#1A1030',
  hairline: '#2A1F45',
  borderStrong: '#3B2B66',
  accent: '#A98BFF',
  accentSoft: 'rgba(169, 139, 255, 0.16)',
  primary: '#7C3AED',
  primaryPressed: '#6D28D9',
  onPrimary: '#FFFFFF',
  text: '#E6DEFA',
  textSecondary: '#8A82A3',
  textTertiary: '#5E5775',
  warning: '#C9A24A',
  danger: '#FF8A8A',
  glassTint: 'rgba(124, 58, 237, 0.14)',
  glowStrong: 'rgba(124, 58, 237, 0.22)',
  glowSoft: 'rgba(124, 58, 237, 0.07)',
  transparent: 'rgba(0, 0, 0, 0)',
} as const;

export const fonts = {
  serif: 'CormorantGaramond_600SemiBold',
} as const;

export const type = {
  largeTitle: { fontFamily: fonts.serif, fontSize: 44, lineHeight: 48, color: colors.accent },
  title: { fontFamily: fonts.serif, fontSize: 30, lineHeight: 34, color: colors.accent },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 28, color: colors.accent },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, lineHeight: 22, color: colors.text },
  subhead: { fontSize: 15, lineHeight: 21, color: colors.textSecondary },
  caption: { fontSize: 13, lineHeight: 18, color: colors.textSecondary },
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: colors.textSecondary,
  },
} as const;

export const radius = {
  artwork: 4,
  control: 12,
  card: 20,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 44,
} as const;

export const layout = {
  screenPadding: 20,
  tabBarClearance: 110,
  miniPlayerClearance: 64,
} as const;
