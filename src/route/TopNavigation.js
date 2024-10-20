import {View, Text, LogBox} from 'react-native';
import React, {lazy} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import RecorderList from '../screens/RecorderList';
import Employee from '../screens/Employee';

const Tab = createMaterialTopTabNavigator();
const TopNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {color: 'black', fontWeight: '400'},
        tabBarActiveTintColor: '#113C6D',
        tabBarInactiveTintColor: '#777777',
      }}>
      <Tab.Screen
        name="RecorderList"
        component={RecorderList}
        key={'RecorderListScreen'}
        options={{
          tabBarLabelStyle: {fontWeight: '500'},
        }}
      />
      <Tab.Screen name="Employee" component={Employee} key={'EmployeeScreen'} 
      options={{
        tabBarLabelStyle: {fontWeight: '500'},
      }}/>
    </Tab.Navigator>
  );
};

export default TopNavigation;
