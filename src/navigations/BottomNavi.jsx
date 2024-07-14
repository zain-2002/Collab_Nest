import React from 'react';
import {  Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserIcon from 'react-native-vector-icons/Entypo';
import UserBookings from '../screens/UserBookings';
import UserFavourite from '../screens/UserFavourite';
import UserProfile from '../screens/UserProfile';
import UserScreen from '../screens/UserScreen';

export default function StyledBottom() {
  const _renderIcon = (routeName, selectedTab) => {
    if (routeName === 'UserProfile') {
      return (
        <UserIcon name="user" size={27} color={routeName === selectedTab ? '#EE5A24' : 'gray'} />
      );
    }

    let icon = '';

    switch (routeName) {
      case 'Home':
        icon = 'home';
        break;
      case 'UserBooking':
        icon = 'book-check';
        break;
      case 'Favourite':
        icon = 'cards-heart';
        break;
    }

    return (
      <Icon name={icon} size={27} color={routeName === selectedTab ? '#EE5A24' : 'gray'} />
    );
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (

    <CurvedBottomBar.Navigator
    screenOptions={{ animation: 'slide_from_bottom', headerShown: false }}
      type="UP"
      style={styles.bottomBar}
      shadowStyle={styles.shawdow}
      height={55}
      circleWidth={50}
      bgColor="white"
      initialRouteName="Home"
      borderTopLeftRight
      renderCircle={({ selectedTab, navigate }) => (
        <Animated.View style={styles.btnCircleUp}>
          <TouchableOpacity
            style={styles.button}
           
          >
            <Ionicons name={'apps-sharp'} color="gray" size={25} />
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBar.Screen name="Home" position="LEFT" component={UserScreen} />
      <CurvedBottomBar.Screen name="UserBooking" position="LEFT" component={UserBookings} />
      <CurvedBottomBar.Screen name="Favourite" component={UserFavourite} position="RIGHT" />
      <CurvedBottomBar.Screen name="UserProfile" component={UserProfile} position="RIGHT" />

    </CurvedBottomBar.Navigator>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
    bottom: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
});
