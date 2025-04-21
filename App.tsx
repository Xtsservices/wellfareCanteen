import * as React from 'react';
import ProfileScreen from './screens/profileScreen';
import HomePage from './screens/homepage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login';
import SelectCanteenScreen from './screens/selectCanteen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SelectCanteen" component={SelectCanteenScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
