import { Provider, useDispatch } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";
import store from "./src/redux/store"; 
import AppNavigator from "./src/router/AppNavigator"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { fetchFollowers, fetchFollowing } from "./src/redux/slices/followSlice";
import { setUserProfile } from "./src/redux/slices/authSlice";


LogBox.ignoreAllLogs(); 

const App = () => {
  return (
    <Provider store={store}> 
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigator />
      </GestureHandlerRootView>
    </Provider>
  );
};
export default App;
