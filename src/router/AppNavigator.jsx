import HomeScreen from '../screens/home/HomeScreen';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SearchScreen from '../screens/search/SearchScreen';
import SplashScreen from '../screens/SplashScreen';
import EntryScreen from '../screens/auth/EntryScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import {SCREENS} from '../utils/router';
import BottomTabNavigator from './BottomTabNavigator';
import ForgetPassword from '../screens/auth/ForgetPassword';
import SignUpScreen from '../screens/auth/SignUpScreen';
import UsernameScreen from '../screens/auth/UsernameScreen';
import MessageScreen from '../screens/messages/MessageScreen';
import ChatScreen from '../screens/messages/ChatScreen';
import PostScreen from '../screens/post/PostScreen';
import FullPostScreen from '../screens/home/FullPostScreen';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import MessageListScreen from '../screens/messages/MessageListScreen';
import StartScreen from '../screens/home/StartScreen';
import {MessageProvider} from '../components/Message/MessageContext';
import PostConfirmScreen from '../screens/post/PostConfirmScreen';
import ResetPassword from '../screens/auth/ResetPassword';
import UserPost from '../components/Profile/UserPost';
import {useDispatch, useSelector} from 'react-redux';
import { userCheck } from '../redux/actions/authActions';
import SearchProfileScreen from '../screens/search/SearchProfileScreen';
import FollowProfileScreen from '../screens/profile/FollowProfileScreen';
import FollowListScreen from '../screens/profile/FollowListScreen';
import { logout } from '../redux/slices/authSlice';
import BrandSearchScreen from '../screens/post/BrandSearchScreen';

const Stack = createNativeStackNavigator();

const {
  STARTSCREEN,
  POSTCONFIRM,
  SPLASHSCREEN,
  MESSAGELISTSCREEN,
  PROFILESCREEN,
  NOTIFICATIONSCREEN,
  POSTSCREEN,
  FULLPOSTSCREEN,
  CHATSCREEN,
  MESSAGESCREEN,
  ENTRYSCREEN,
  HOMESCREEN,
  USERNAMESCREEN,
  USERPOST,
  SEARCHSCREEN,
  SIGNINSCREEN,
  SIGNUPSCREEN,
  FORGETPASSWORDSCREEN,
  RESETPASSWORDSCREEN,
  SEARCHPROFILE,
  FOLLOWPROFILE,
  FOLLOWLIST,
  BRANDSEARCH
} = SCREENS;

// Deep linking yapılandırması
const linking = {
  prefixes: ['http://localhost:8081', 'styleup://'],
  config: {
    screens: {
      [RESETPASSWORDSCREEN]: {
        path: 'reset-password/:token',
        parse: {
          token: token => token,
        },
      },
      [SIGNINSCREEN]: 'signin',
      [FORGETPASSWORDSCREEN]: 'forget-password',
    },
  },
};

const AppNavigator = () => {
  const {isLogin} = useSelector(state => state.auth);
  const dispatch=useDispatch()
  useEffect(() => {
  dispatch(userCheck())
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      try {
        const result = await dispatch(userCheck()).unwrap();
        console.log('Oturum kontrolü başarılı:', result);
      } catch (error) {
        console.log('Oturum kontrolü hatası:', error);
        dispatch(logout()); 
      }
    };
    
    initAuth();
  }, [dispatch]);
  return (
    <MessageProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {!isLogin ? (
            <Stack.Group>
              <Stack.Screen name={SPLASHSCREEN} component={SplashScreen} />
              <Stack.Screen name={ENTRYSCREEN} component={EntryScreen} />
              <Stack.Screen name={SIGNINSCREEN} component={SignInScreen} />
              <Stack.Screen
                name={FORGETPASSWORDSCREEN}
                component={ForgetPassword}
              />
              <Stack.Screen
                name={RESETPASSWORDSCREEN}
                component={ResetPassword}
              />
              <Stack.Screen name={SIGNUPSCREEN} component={SignUpScreen} />
              <Stack.Screen name={USERNAMESCREEN} component={UsernameScreen} />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="Main" component={BottomTabNavigator} />
              <Stack.Screen name={FULLPOSTSCREEN} component={FullPostScreen} />
              <Stack.Screen name={CHATSCREEN} component={ChatScreen} />
              <Stack.Screen name={MESSAGESCREEN} component={MessageScreen} />
              <Stack.Screen name={STARTSCREEN} component={StartScreen} />
              <Stack.Screen name={POSTCONFIRM} component={PostConfirmScreen} />
              <Stack.Screen name={USERPOST} component={UserPost} />
              <Stack.Screen name={SEARCHPROFILE} component={SearchProfileScreen} />
              <Stack.Screen name={FOLLOWPROFILE} component={FollowProfileScreen} />
              <Stack.Screen name={FOLLOWLIST} component={FollowListScreen} />
              <Stack.Screen name={BRANDSEARCH} component={BrandSearchScreen} />
              <Stack.Screen
                name={MESSAGELISTSCREEN}
                component={MessageListScreen}
                options={{tabBarStyle: {display: 'flex'}}}
              />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </MessageProvider>
  );
};

export default AppNavigator;
