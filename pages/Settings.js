import * as React from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  Image,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
export default function SettingScreen({ navigation }) {
  return (
    <SafeAreaView className="bg-white h-full flex items-center justify-center">
      <Text>Settings</Text>
    </SafeAreaView>
  );
}
