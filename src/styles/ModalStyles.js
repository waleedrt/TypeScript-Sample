import { Dimensions, StyleSheet } from 'react-native';

const daySize = (Dimensions.get('window').width - 150) / 7
const deviceHeight = Dimensions.get('window').height;

import MasterStyles from './MasterStyles';

export default StyleSheet.create({
  modal: {
    flexBasis: deviceHeight - 100,
    backgroundColor: MasterStyles.colors.white,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  picker: {
    width: 200,
    alignSelf: 'center'
  },

  pickerItem: {
    height: 150,
    fontFamily: MasterStyles.fonts.mainFont,
    fontSize: 14
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  selectedDay: {
    alignItems: 'center',
    justifyContent: 'center',
    width: daySize,
    height: daySize,
    marginRight: 5,
    backgroundColor: MasterStyles.officialColors.brightSkyShade2,
    borderRadius: 7.5
  },
  unselectedDay: {
    alignItems: 'center',
    justifyContent: 'center',
    width: daySize,
    height: daySize,
    marginRight: 5,
    backgroundColor: MasterStyles.officialColors.density,
    borderRadius: 7.5
  },
  dayText: {
    color: 'white',
    fontFamily: MasterStyles.fonts.boldFont
  },
  pickerItem: {
    height: 150,
    color: MasterStyles.colors.gray,
    fontFamily: MasterStyles.fonts.mainFont,
    fontSize: 14
  }
});
