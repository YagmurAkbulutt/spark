import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";
import store from "./src/redux/store"; 
import AppNavigator from "./src/router/AppNavigator"; 

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




