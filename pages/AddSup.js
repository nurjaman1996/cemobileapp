import * as React from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { BASE_URL } from "@env";

export default function AddSup({ route, navigation }) {
  const [showStart, setShowStart] = React.useState(false);
  const [showEnd, setShowEnd] = React.useState(false);

  const [dateStart, setDateStart] = React.useState(new Date());
  const [dateEnd, setDateEnd] = React.useState(new Date());

  const [v_supplier, setv_supplier] = React.useState("");
  const [v_kontak, setv_kontak] = React.useState("");
  const [v_alamat, setv_alamat] = React.useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowStart(!showStart);
    setDateStart(currentDate);
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowEnd(!showEnd);
    setDateEnd(currentDate);
  };

  async function savePo() {
    // console.log(v_supplier);
    // console.log(v_kontak);
    // console.log(v_alamat);
    if (v_supplier === "") {
      alert("Mohon Isi Nama Supplier");
    } else {
      await axios({
        method: "post",
        url: `http://139.180.130.182:4000/supplier`,
        data: {
          supplier: v_supplier,
          contact: v_kontak,
          alamat: v_alamat,
        },
      })
        .then(function (response) {
          alert("Success Input Supplier");
          navigation.goBack();
        })
        .catch(function (error) {
          // handle error
          alert(error);
        });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView className="bg-white flex-1 h-full">
        <ScrollView
          keyboardDismissMode="interactive"
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 100,
          }}
          automaticallyAdjustKeyboardInsets={true}
          className="flex-col h-full space-y-5 px-2 pt-5"
        >
          <View className="grow justify-start items-start px-2">
            <Text className="text-xs mb-1">NAMA SUPPLIER</Text>
            <TextInput
              style={styles.input2}
              value={v_supplier}
              onChange={(e) => {
                setv_supplier(e.nativeEvent.text.toUpperCase());
              }}
              keyboardType={"default"}
            />
          </View>

          <View className="grow justify-start items-start px-2">
            <Text className="text-xs mb-1">KONTAK</Text>
            <TextInput
              style={styles.input2}
              value={v_kontak}
              onChange={(e) => {
                setv_kontak(e.nativeEvent.text);
              }}
              keyboardType={"phone-pad"}
            />
          </View>

          <View className="grow justify-start items-start px-2 mb-4">
            <Text className="text-xs mb-1">ALAMAT</Text>
            <TextInput
              style={styles.input2}
              value={v_alamat}
              onChange={(e) => {
                setv_alamat(e.nativeEvent.text);
              }}
              keyboardType={"default"}
            />
          </View>

          <View className="grow justify-start items-start px-2 w-full">
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                savePo();
              }}
            >
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    width: "100%",
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },

  input: {
    height: 45,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    borderRadius: 8,
    borderColor: "#8EA4BB",
  },

  input2: {
    height: 45,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    borderRadius: 8,
    borderColor: "#8EA4BB",
    textAlign: "center",
  },
});
