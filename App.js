import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import Auth from "./src/screens/Auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ChatList from "./src/screens/ChatList";
import ChatScreen from "./src/screens/ChatScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Bold: require("./assets/fonts/GTMaruBold.ttf"),
    Medium: require("./assets/fonts/GTMaruMedium.ttf"),
    Light: require("./assets/fonts/GTMaruLight.ttf"),
    Regular: require("./assets/fonts/GTMaruRegular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            // headerBackTitleVisible: false,
            // gestureEnabled: true,
            // animationEnabled: true,
            // animationTypeForReplace: "push",
          }}
        >
          {/* <Stack.Screen component={Auth} name="Auth" /> */}
          <Stack.Screen component={ChatList} name="ChatList" />
          <Stack.Screen component={ChatScreen} name="ChatScreen" />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={"light-content"}
      />
    </>
  );
}
