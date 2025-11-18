import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Splash Screens
import SplashSignInScreen from '../screens/SplashSignInScreen';
import SplashNormalScreen from '../screens/SplashNormalScreen';

// Home Screen
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashSignIn"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Splash Screens */}
        <Stack.Screen 
          name="SplashSignIn" 
          component={SplashSignInScreen}
          options={{ 
            title: 'Splash Sign In',
            headerShown: false  // Splash 화면에서는 헤더 숨김
          }}
        />
        <Stack.Screen 
          name="SplashNormal" 
          component={SplashNormalScreen}
          options={{ 
            title: 'Splash',
            headerShown: false
          }}
        />
        
        {/* Home Screen */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Tuple' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


