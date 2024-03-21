import { StyleSheet, Platform } from 'react-native';

const transparent = 'transparent';
const blue = '#6794B8';
const blueDark = '#176087';
const navyBlue = '#0E537F';
const green = '#4CD78D';
const grayLight = '#BFC0C1';
const navigationGray = '#F7F7F7';
const gray = '#707070';
const red = '#D8554A';
const whiteOpaque = 'rgba(255, 255, 255, 0.9)';
const semiTransparentWhite = 'rgba(255, 255, 255, 0.50)';
const blackOpaque = 'rgba(0, 0, 0, 0.50)';
const white = '#FFF';
const turquoiseLight = '#70AFAD';
const slate = '#7FAEBF';
const darkSlate = '#176087';
const tan = '#C2C5BB';
const purpleGray = '#81667A';

const colors = {
  blue,
  blueDark,
  green,
  grayLight,
  gray,
  red,
  whiteOpaque,
  semiTransparentWhite,
  blackOpaque,
  turquoiseLight,
  navyBlue,
  white,
  transparent,
  slate,
  darkSlate,
  navigationGray,
  tan,
  purpleGray,
};

const officialColors = {
  brightSky: '#00AEEA',
  brightSkyShade1: '#1DA3D1',
  brightSkyShade2: '#279EC6',
  brightSkyShade3: '#3097BB',
  brightSkyShade4: '#3088A6',
  groundSunflower: '#C0AF8B',
  groundSunflower1: '#B29D71',
  groundSunflower2: '#A99260',
  groundSunflower3: '#9B8554',
  groundSunflower4: '#917C4F',
  mermaid: '#00B88D',
  mermaidShade1: '#1AAD8B',
  mermaidShade2: '#23A486',
  mermaidShade3: '#2D9A81',
  mermaidShade4: '#2D8671',
  dirtySnow: '#F1F1F1',
  cloudy: '#B8B8B8',
  density: '#7B7B7B',
  graphite: '#595959',
  error: '#8A2E2E',
};

const gradientColors = {
  officialBrightBlue: 'rgb(0,174,239)',
  officialBrightGreen: 'rgb(0,166,81)',
  officialGray: 'rgb(128, 130, 133)',
  mutedBlueTwo: 'rgb(29,161,209)',
  mutedBlueFour: 'rgb(48,150,187)',
  mutedBlueSix: 'rgb(46,113,138)',
  mutedGreenTwo: 'rgb(26,173,97)',
  mutedGreenFour: 'rgb(45,154,98)',
  mutedGreenSix: 'rgb(45,118,80)',
  mutedAlternateGreenTwo: '#1AAD8B',
  mutedAlternateGreenFour: '#2D9A81',
  mutedAlternateGreenSix: '#2D7665',

  mutedPurple: 'rgb(129,102,122)',
  mutedGrayBlue: '#478CA3',
  blue1: '#267692',
  blue2: '#4797B3',
  blue3: '#279EC6',
  blue4: '#3097BB',
  green1: '#336350',
  green2: '#4C8C73',
  green3: '#23A486',
  green4: '#2D9A81',
};

const mainFont = Platform.OS === 'ios' ? 'System' : 'OpenSans-Regular';
const boldFont = Platform.OS === 'ios' ? 'System' : 'OpenSans-Regular';

const fonts = {
  mainFont,
  boldFont,
};

const common = StyleSheet.create({
  horizontalMargins25: {
    marginHorizontal: 25,
  },
  horizontalPadding25: {
    paddingHorizontal: 25,
  },
  verticalMargins20: {
    marginVertical: 20,
  },
  verticalMargins25: {
    marginVertical: 25,
  },
  verticalPadding25: {
    paddingVertical: 25,
  },
  genericButton: {
    flexBasis: 50,
    minHeight: 50,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'center',
  },
});

const fontStyles = StyleSheet.create({
  dominantText:
    Platform.OS === 'ios'
      ? {
          fontSize: 40,
          color: colors.white,
          fontWeight: 'bold',
        }
      : {
          fontSize: 37,
          color: colors.white,
          letterSpacing: -1,
          fontFamily: 'OpenSans-Bold',
        },
  screenTitle:
    Platform.OS === 'ios'
      ? {
          fontSize: 32,
          color: colors.white,
          fontWeight: '700',
        }
      : {
          fontSize: 30,
          color: colors.white,
          letterSpacing: -1,
          fontFamily: 'OpenSans-SemiBold',
        },
  contentHeaderDark:
    Platform.OS === 'ios'
      ? {
          fontSize: 24,
          color: officialColors.graphite,
          fontWeight: '500',
        }
      : {
          fontFamily: 'OpenSans-SemiBold',
          fontSize: 22,
          letterSpacing: -0.5,
          color: officialColors.graphite,
        },
  contentHeader:
    Platform.OS === 'ios'
      ? {
          fontSize: 28,
          color: colors.white,
          fontWeight: '500',
        }
      : {
          fontFamily: 'OpenSans-SemiBold',
          fontSize: 26,
          letterSpacing: -0.5,
          color: colors.white,
        },
  contentHeaderThin:
    Platform.OS === 'ios'
      ? {
          fontSize: 24,
          fontWeight: '300',
        }
      : {
          fontFamily: 'OpenSans-Light',
          fontSize: 22,
          letterSpacing: -0.5,
        },
  contentSubheader:
    Platform.OS === 'ios'
      ? {
          fontSize: 22,
          fontWeight: '500',
          color: officialColors.graphite,
        }
      : {
          fontSize: 20,
          fontFamily: 'OpenSans-SemiBold',
          color: officialColors.graphite,
          letterSpacing: -0.5,
        },
  contentMinorheader:
    Platform.OS === 'ios'
      ? {
          fontSize: 16,
          fontWeight: '500',
          color: officialColors.graphite,
        }
      : {
          fontSize: 15,
          fontFamily: 'OpenSans-SemiBold',
          color: officialColors.graphite,
          letterSpacing: -0.5,
        },
  modalTitle:
    Platform.OS === 'ios'
      ? {
          fontSize: 22,
          color: officialColors.graphite,
          fontWeight: '500',
          paddingBottom: 10,
        }
      : {
          fontSize: 20,
          color: officialColors.graphite,
          fontFamily: 'OpenSans-SemiBold',
          paddingBottom: 10,
          letterSpacing: -0.5,
        },
  modalBodyHighlight:
    Platform.OS === 'ios'
      ? {
          fontSize: 18,
          color: officialColors.density,
          fontWeight: '500',
        }
      : {
          fontSize: 16,
          color: officialColors.density,
          fontFamily: 'OpenSans-SemiBold',
          letterSpacing: -0.5,
        },
  modalBody:
    Platform.OS === 'ios'
      ? {
          fontSize: 16,
          color: officialColors.density,
          lineHeight: 22,
          textAlign: 'center',
        }
      : {
          fontSize: 15,
          fontFamily: 'OpenSans-Regular',
          color: officialColors.density,
          lineHeight: 22,
          textAlign: 'center',
          letterSpacing: -0.5,
        },
  modalBodySmall:
    Platform.OS === 'ios'
      ? {
          fontSize: 12,
          color: officialColors.density,
        }
      : {
          fontSize: 11,
          fontFamily: 'OpenSans-Regular',
          color: officialColors.density,
          letterSpacing: -0.5,
        },
  generalContent:
    Platform.OS === 'ios'
      ? {
          fontSize: 19,
          color: white,
          fontFamily: 'System',
          lineHeight: 26,
          fontWeight: '300',
        }
      : {
          fontSize: 17,
          color: white,
          fontFamily: 'OpenSans-Regular',
          lineHeight: 24,
          letterSpacing: -0.25,
        },
  generalContentDark:
    Platform.OS === 'ios'
      ? {
          fontSize: 19,
          color: officialColors.density,
          fontFamily: 'System',
          lineHeight: 26,
          fontWeight: '300',
        }
      : {
          fontSize: 17,
          color: officialColors.density,
          fontFamily: 'OpenSans-Regular',
          lineHeight: 24,
          letterSpacing: -0.5,
        },
  generalContentSmall:
    Platform.OS === 'ios'
      ? {
          fontSize: 16,
          color: white,
          fontFamily: 'System',
          lineHeight: 22,
          fontWeight: '300',
        }
      : {
          fontSize: 15,
          color: white,
          fontFamily: 'OpenSans-Light',
          lineHeight: 22,
          letterSpacing: -0.5,
        },
  generalContentSmallDark:
    Platform.OS === 'ios'
      ? {
          fontSize: 16,
          color: officialColors.density,
          fontFamily: 'System',
          lineHeight: 22,
          fontWeight: '300',
        }
      : {
          fontSize: 15,
          color: officialColors.density,
          fontFamily: 'OpenSans-Regular',
          lineHeight: 22,
          letterSpacing: -0.5,
        },
  generalContentDarkInfoHighlight:
    Platform.OS === 'ios'
      ? {
          fontSize: 13,
          color: officialColors.density,
          fontFamily: 'System',
          // lineHeight: 22,
          fontWeight: '500',
        }
      : {
          fontSize: 12,
          color: officialColors.density,
          fontFamily: 'OpenSans-SemiBold',
          // lineHeight: 22,
          // letterSpacing: -0.5,
        },
  generalContentInfoHighlightRegular:
    Platform.OS === 'ios'
      ? {
          fontSize: 13,
          fontFamily: 'System',
        }
      : {
          fontSize: 12,
          fontFamily: 'OpenSans-Regular',
        },
  detailSemiBold:
    Platform.OS === 'ios'
      ? {
          fontSize: 10,
          color: officialColors.density,
          fontFamily: 'System',
          lineHeight: 22,
          fontWeight: '500',
        }
      : {
          fontSize: 10,
          color: officialColors.density,
          fontFamily: 'OpenSans-SemiBold',
          lineHeight: 22,
          // letterSpacing: -0.5,
        },
  pickerFont: {
    fontSize: 32,
    fontFamily: 'System',
    color: white,
  },
  buttonFont:
    Platform.OS === 'ios'
      ? {
          fontFamily: 'System',
          fontWeight: '700',
          fontSize: 16,
        }
      : {
          fontFamily: 'OpenSans-Bold',
          fontSize: 15,
        },
});

const MasterStyles = {
  colors,
  fonts,
  common,
  gradientColors,
  officialColors,
  fontStyles,
};

export default MasterStyles;
