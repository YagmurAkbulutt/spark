import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SCREENS } from "../utils/router";
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import PostScreen from '../screens/post/PostScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import { getFocusedRouteNameFromRoute, useNavigationState } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import SvgHome from "../assets/home";
import SvgSearch from "../assets/search";
import SvgPost from "../assets/plus";
import SvgNotifications from "../assets/notifications";
import SvgProfile from "../assets/profile";
import SvgHomeFill from "../assets/homeFill";
import SvgSearchFill from "../assets/searchFill";
import SvgPostFill from "../assets/postFill";
import SvgNotificationFill from "../assets/notificationFill";
import SvgProfileFill from "../assets/profileFill";

const Tab = createBottomTabNavigator();
const { HOMESCREEN, SEARCHSCREEN, POSTSCREEN, NOTIFICATIONSCREEN, PROFILESCREEN } = SCREENS;

const tabHiddenRoutes = [
  "SPLASHSCREEN",
  "ENTRYSCREEN",
  "SIGNINSCREEN",
  "SIGNUPSCREEN",
  "POSTSCREEN",
  "FORGETPASSWORDSCREEN",
  "FULLPOSTSCREEN",
  "USERNAMESCREEN",
  "CHATSCREEN",
];

const BottomTabNavigator = () => {
  const [shouldHideTabBar, setShouldHideTabBar] = useState(false);
  const navigationState = useNavigationState(state => state);

  useEffect(() => {
    const currentRoute = navigationState?.routes?.[navigationState.index]?.name;
    setShouldHideTabBar(tabHiddenRoutes.includes(currentRoute));
  }, [navigationState]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          display: shouldHideTabBar ? "none" : "flex", 
        }
      }}
    
    >
      <Tab.Screen
        options={{ tabBarIcon: ({ focused }) => (focused ? <SvgHomeFill /> : <SvgHome />) }}
        name={HOMESCREEN}
        component={HomeScreen}
      />
      <Tab.Screen options={{ tabBarIcon: ({focused}) => (focused ? <SvgSearchFill/> : <SvgSearch/>) }} name={SEARCHSCREEN} component={SearchScreen} />
      <Tab.Screen 
      options={{
         tabBarIcon: ({focused}) => (focused ? <SvgPostFill/> : <SvgPost/>),
         tabBarStyle:{
          display:"none"
         } 
         
         }} name={POSTSCREEN} component={PostScreen} />
      <Tab.Screen options={{ tabBarIcon: ({focused}) => (focused ? <SvgNotificationFill/> : <SvgNotifications />) }} name={NOTIFICATIONSCREEN} component={NotificationsScreen} />
      <Tab.Screen options={{ tabBarIcon: ({focused}) => (focused ? <SvgProfileFill/> : <SvgProfile />) }} name={PROFILESCREEN} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
