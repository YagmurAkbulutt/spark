import HomeScreen from '../screens/home/HomeScreen';
import { getFocusedRouteNameFromRoute, NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/search/SearchScreen';
import SplashScreen from '../screens/SplashScreen';
import EntryScreen from '../screens/auth/EntryScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import { SCREENS } from "../utils/router"
import BottomTabNavigator from './BottomTabNavigator';
import ForgetPassword from '../screens/auth/ForgetPassword';
import SignUpScreen from '../screens/auth/SignUpScreen';
import UsernameScreen from '../screens/auth/UsernameScreen';
import MessageScreen from '../screens/messages/MessageScreen';
import ChatScreen from '../screens/messages/ChatScreen';
import PostScreen from '../screens/PostScreen';
import FullPostScreen from '../screens/home/FullPostScreen';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import MessageListScreen from '../screens/messages/MessageListScreen';
import StartScreen from '../screens/home/StartScreen';
import { MessageProvider } from '../components/Message/MessageContext';
import PostConfirmScreen from '../screens/post/PostConfirmScreen';



const Stack = createNativeStackNavigator();

const { 
  STARTSCREEN, POSTCONFIRM, SPLASHSCREEN, MESSAGELISTSCREEN, PROFILESCREEN, NOTIFICATIONSCREEN, 
  POSTSCREEN, FULLPOSTSCREEN, CHATSCREEN, MESSAGESCREEN, ENTRYSCREEN, HOMESCREEN, 
  USERNAMESCREEN,  SEARCHSCREEN,  SIGNINSCREEN, SIGNUPSCREEN, FORGETPASSWORDSCREEN 
} = SCREENS;

const AppNavigator = () => {
  return (
    <MessageProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        
          <Stack.Screen name={SPLASHSCREEN} component={SplashScreen} />
          <Stack.Screen name={ENTRYSCREEN} component={EntryScreen} />
          <Stack.Screen name={SIGNINSCREEN} component={SignInScreen} />
          <Stack.Screen name={FORGETPASSWORDSCREEN} component={ForgetPassword} />
          <Stack.Screen name={SIGNUPSCREEN} component={SignUpScreen} />
          <Stack.Screen name={USERNAMESCREEN} component={UsernameScreen} />
          <Stack.Screen name={FULLPOSTSCREEN} component={FullPostScreen} />
          <Stack.Screen name={CHATSCREEN} component={ChatScreen} />
          <Stack.Screen name={MESSAGESCREEN} component={MessageScreen} />
          <Stack.Screen name={STARTSCREEN} component={StartScreen} />
          <Stack.Screen name={POSTCONFIRM} component={PostConfirmScreen} />
         
          <Stack.Screen 
            name={MESSAGELISTSCREEN} 
            component={MessageListScreen} 
            options={{ tabBarStyle: { display: "flex" } }} 
          />
          
          <Stack.Screen name="Main" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </MessageProvider>
  );
};

export default AppNavigator;
