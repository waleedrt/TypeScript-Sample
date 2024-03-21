import { StyleSheet } from 'react-native';

import MasterStyles from './MasterStyles';

const NotificationsModalStyles = StyleSheet.create({
  dayContainer: {
    flexDirection: 'row',
    // justifyContent: 'center',
    marginTop: 10
  },

  pickerItem: {
    height: 150,
    fontFamily: MasterStyles.fonts.mainFont,
    fontSize: 16
  }
});

export default NotificationsModalStyles;
