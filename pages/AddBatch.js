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

export default function AddBatch({ route, navigation }) {
  const [showStart, setShowStart] = React.useState(false);
  const [showEnd, setShowEnd] = React.useState(false);

  const [dateStart, setDateStart] = React.useState(new Date());

  const [country, setcountry] = React.useState("");
  const [city, setcity] = React.useState("");

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
    // console.log(dayjs(dateStart).format("YYYY-MM-DD"));
    // console.log(country);
    // console.log(city);
    if (country === "" || city === "") {
      alert("Mohon Lengkapi Semua Data");
    } else {
      await axios({
        method: "post",
        url: `http://139.180.130.182:4000/purchaseorder/insertbatch`,
        data: {
          tanggal_batch: dayjs(dateStart).format("YYYY-MM-DD"),
          country: country,
          city: city,
        },
      })
        .then(function (response) {
          alert("Success Input Batch");
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
          automaticallyAdjustKeyboardInsets={true}
          className="flex-col h-full space-y-5 px-2 pt-5"
        >
          <View className="grow justify-start items-start px-2">
            <Text className="text-xs mb-1">Tanggal Keberangkatan</Text>
            <TouchableOpacity
              className="w-full"
              onPress={() => setShowStart(!showStart)}
            >
              <Text className="pt-[3.5%]" style={styles.input2}>
                {dayjs(dateStart).format("YYYY-MM-DD")}
              </Text>
            </TouchableOpacity>
          </View>

          {showStart && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateStart}
              mode={"date"}
              is24Hour={true}
              onChange={onChange}
              display={"inline"}
            />
          )}

          <View className="grow justify-start items-start px-2">
            <Text className="text-xs mb-1">Negara</Text>
            <TextInput
              style={styles.input2}
              value={country}
              onChange={(e) => {
                setcountry(e.nativeEvent.text);
              }}
              keyboardType={"default"}
            />
          </View>

          <View className="grow justify-start items-start px-2 mb-4">
            <Text className="text-xs mb-1">Kota</Text>
            <TextInput
              style={styles.input2}
              value={city}
              onChange={(e) => {
                setcity(e.nativeEvent.text);
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
