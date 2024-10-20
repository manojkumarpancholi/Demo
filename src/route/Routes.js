import {View, Text, Image} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TopNavigation from './TopNavigation';
import SoundRecodre from '../screens/SoundRecodre';

const Routes = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Top"
          component={TopNavigation}
          options={{
            title: 'My Recorder',
            headerStyle: {backgroundColor: '#113C6D'},
            headerTitleStyle: {color: '#fff'},
            headerLeft: () => {
              return (
                <Image
                  source={require('../assets/menu.png')}
                  style={{marginLeft: 10}}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="SoundRecodre"
          component={SoundRecodre}
          options={{
            title: 'Recording',
            headerStyle: {backgroundColor: '#113C6D'},
            headerTitleStyle: {color: '#fff'},
            headerBackImage: () => {
              return (
                <Image
                  source={require('../assets/back.png')}
                  style={{marginLeft: 10}}
                />
              );
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
