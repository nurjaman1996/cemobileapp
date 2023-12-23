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

export default function AddBatch({ route, navigation }) {
  const { data } = route.params;

  const [showStart, setShowStart] = React.useState(false);

  const [dateStart, setDateStart] = React.useState(new Date());

  const [country, setcountry] = React.useState("");
  const [city, setcity] = React.useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowStart(!showStart);
    setDateStart(currentDate);
  };

  async function editBatch() {
    // console.log(dayjs(dateStart).format("YYYY-MM-DD"));
    // console.log(country);
    // console.log(city);

    try {
      await axios({
        method: "post",
        url: `${process.env.EXPO_PUBLIC_BASE_URL}/dekstop/editbatch`,
        data: {
          id_batch: data.id_batch,
          country: country,
          city: city,
        },
      });
      alert("Update Sukes");
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    setDateStart(new Date("2023-12-12T20:47:21.000Z"));
    setcountry(data.country);
    setcity(data.city);
  }, []);

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
          {/* <View className="grow justify-start items-start px-2">
            <Text className="text-xs mb-1 font-bold">DATE OF DEPARTURE</Text>
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
          )} */}

          <View className="grow justify-start items-start px-2">
            <Text className="text-xs mb-1 font-bold">COUNTRY</Text>
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
            <Text className="text-xs mb-1 font-bold">CITY</Text>
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
                editBatch();
              }}
            >
              <Text style={styles.text}>Update</Text>
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
    borderRadius: 15,
    elevation: 3,
    width: "100%",
    backgroundColor: "#D13D3D",
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
