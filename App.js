import * as React from "react";
import { Text, View, Button, StatusBar, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import Dashboard from "./pages/Dashboard";
import Batch from "./pages/Batch";
import Prapo from "./pages/Prapo";
import Iventory from "./pages/Iventory";
import Settings from "./pages/Settings";
import AddProduct from "./pages/AddProduct";
import AddPo from "./pages/AddPo";
import AddSup from "./pages/AddSup";
import AddBatch from "./pages/AddBatch";
import DetailProduct from "./pages/DetailProduct";
import AddPurchasing from "./pages/AddPurchasing";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTab() {
  const [SplashScreen, setSplashScreen] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setSplashScreen(false);
    }, 2500);
  }, []);

  if (SplashScreen) {
    return (
      <View
        style={{
          flex: 1,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#D13D3D",
        }}
      >
        <View className="w-full aspect-square">
          <Image
            source={require("./assets/splash.png")}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
            }}
          />
        </View>
      </View>
    );
  } else {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            height: 85,
          },
          tabBarItemStyle: {
            padding: 5,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Dashboard") {
              iconName = focused ? "grid" : "grid-outline";
            } else if (route.name === "Data Batch") {
              iconName = focused ? "folder" : "folder-outline";
            } else if (route.name === "Data PO") {
              iconName = focused ? "document" : "document-outline";
            } else if (route.name === "Data Inventory") {
              iconName = focused ? "cube" : "cube-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#D13D3D",
          tabBarInactiveTintColor: "#4F4F4F",
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Data Inventory"
          component={Iventory}
          options={{ headerShown: true }}
        />

        <Tab.Screen
          name="Data PO"
          component={Prapo}
          options={{ headerShown: true }}
        />

        <Tab.Screen
          name="Data Batch"
          component={Batch}
          options={{ headerShown: true }}
        />
        {/* 
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      /> */}
      </Tab.Navigator>
    );
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen
          name="MainTab"
          component={MainTab}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="AddPo" component={AddPo} />
        <Stack.Screen name="AddSup" component={AddSup} />
        <Stack.Screen name="AddBatch" component={AddBatch} />
        <Stack.Screen name="DetailProduct" component={DetailProduct} />
        <Stack.Screen name="AddPurchasing" component={AddPurchasing} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
