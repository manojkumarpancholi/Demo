/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {StatusBar, Text, View} from 'react-native';
import React from 'react';
import Routes from './src/route/Routes';


const App = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'#113C6D'}/>
      <Routes/>
    </View>
  );
};

export default App;
