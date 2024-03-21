import MasterStyles from './MasterStyles';

const OnboardingStyles = {
  bgImageWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  whiteLogo: {
    width: 250,
    height: 167,
    resizeMode: 'contain',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    marginBottom: 50,
  },
  icon: {
    fontSize: 45,
    color: 'white',
  },
  description: {
    color: 'white',
    fontSize: 14,
    paddingLeft: 40,
    paddingRight: 40,
    textAlign: 'center',
    fontFamily: MasterStyles.fonts.mainFont,
  },
  header: {
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 16,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: MasterStyles.fonts.boldFont,
  },
};


export default OnboardingStyles;
