import * as React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
//Screens
import HomeScreen from '../screens/HomeScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}} initialRouteName="Chats">
      <Tab.Screen
        name="Chats"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="chat" color={color} size={28} />
          ),
        }} 
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="auto-awesome" color={color} size={28} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({});

export default BottomNavigation;
