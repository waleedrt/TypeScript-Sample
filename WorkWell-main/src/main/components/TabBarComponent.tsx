/**
 * The TabBarComponent provides the bar at the bottom of the most screens
 * where the user is able to navigate between 'Home', 'Library' and 'Profile'.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { TabRouteOptions } from '../navigator';
import MasterStyles from '../../styles/MasterStyles';
import { LinearGradient } from 'expo-linear-gradient';
import useGlobalPendingAPIOperations from '../../hooks/useGlobalPendingAPIOperations';

function TabBar({
  navigation,
  state,
}: {
  navigation: BottomTabNavigationProp<TabRouteOptions>;
  state: any;
}) {
  const safeAreaPadding = useSafeArea();

  const pendingAPIOperations = useGlobalPendingAPIOperations();
  const [waitingForAPI, setWaitingForAPI] = useState(false);

  const hideTabBar = state.routes[state.index].state?.index ?? 0 ? true : false;

  useEffect(() => {
    pendingAPIOperations.length
      ? setWaitingForAPI(true)
      : setWaitingForAPI(false);
  }, [pendingAPIOperations.length]);

  if (hideTabBar) return <></>;

  return (
    <View
      style={{
        height: 80 + safeAreaPadding.bottom / 3,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <LinearGradient
        colors={[
          MasterStyles.officialColors.brightSkyShade1,
          MasterStyles.officialColors.groundSunflower,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 5 }}
      />
      <View
        style={{
          backgroundColor: 'white',
          opacity: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingHorizontal: 25,
          paddingTop: 10,
          height: 80 + safeAreaPadding.bottom / 3,
        }}
      >
        <TouchableOpacity
          disabled={waitingForAPI}
          onPress={() => navigation.jumpTo('HomeStack')}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Image source={require('../../../assets/icons/tabBar/home.png')} />
          <Text
            style={{
              ...MasterStyles.fontStyles.generalContentSmallDark,
              fontSize: 12,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            HOME
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={waitingForAPI}
          onPress={() => navigation.jumpTo('LibraryStack')}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Image source={require('../../../assets/icons/tabBar/library.png')} />
          <Text
            style={{
              ...MasterStyles.fontStyles.generalContentSmallDark,
              fontSize: 12,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            LIBRARY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={waitingForAPI}
          onPress={() => navigation.jumpTo('ProfileStack')}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Image source={require('../../../assets/icons/tabBar/user.png')} />
          <Text
            style={{
              ...MasterStyles.fontStyles.generalContentSmallDark,
              fontSize: 12,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            PROFILE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={waitingForAPI}
          onPress={() => navigation.jumpTo('HistoryStack')}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Image source={require('../../../assets/icons/tabBar/history.png')} />
          <Text
            style={{
              ...MasterStyles.fontStyles.generalContentSmallDark,
              fontSize: 12,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            HISTORY
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TabBar;
