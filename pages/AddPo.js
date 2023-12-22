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

export default function AddPo({ route, navigation }) {
  const { id_batch } = route.params;

  const [showStart, setShowStart] = React.useState(false);
  const [showEnd, setShowEnd] = React.useState(false);

  const [dateStart, setDateStart] = React.useState(new Date());
  const [dateEnd, setDateEnd] = React.useState(new Date());

  const [v_kurs, setv_kurs] = React.useState("");
  const [v_overhead, setv_overhead] = React.useState("");
  const [v_margin, setv_margin] = React.useState("");

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
    // console.log(id_batch);
    // console.log(dayjs(dateStart).format("YYYY-MM-DD"));
    // console.log(dayjs(dateEnd).format("YYYY-MM-DD"));
    // console.log(v_kurs);
    // console.log(v_overhead);
    // console.log(v_margin);
    if (v_kurs === "" || v_overhead === "" || v_margin === "") {
      alert("Mohon Lengkapi Semua Data");
    } else {
      await axios({
        method: "post",
        url: `${process.env.EXPO_PUBLIC_BASE_URL}/purchaseorder/insertpo`,
        data: {
          id_batch: id_batch,
          tanggal_startpo: dayjs(dateStart).format("YYYY-MM-DD"),
          tanggal_endpo: dayjs(dateEnd).format("YYYY-MM-DD"),
          kurs: v_kurs,
          overhead_gr: v_overhead,
          margin: v_margin,
        },
      })
        .then(function (response) {
          alert("Success Input PO");
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
            <Text className="text-xs mb-1 font-bold">BATCH</Text>
            <TextInput
              value={id_batch}
              editable={false}
              style={styles.input2}
            />
          </View>

          <View className="grow justify-start items-start px-2">
            <Text className="text-xs mb-1 font-bold">START DATE PO</Text>
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
            <Text className="text-xs mb-1 font-bold">END DATE PO</Text>
            <TouchableOpacity
              className="w-full"
              onPress={() => setShowEnd(!showEnd)}
            >
              <Text className="pt-[3.5%]" style={styles.input2}>
                {dayjs(dateEnd).format("YYYY-MM-DD")}
              </Text>
            </TouchableOpacity>
          </View>

          {showEnd && (
            <DateTimePicker
              testID="dateTimePicker2"
              value={dateEnd}
              mode={"date"}
              is24Hour={true}
              onChange={onChange2}
              display={"inline"}
            />
          )}

          <View className="grow justify-start items-start px-2">
            <Text className="text-xs mb-1 font-bold">KURS</Text>
            <TextInput
              style={styles.input2}
              value={v_kurs}
              onChange={(e) => {
                setv_kurs(e.nativeEvent.text);
              }}
              keyboardType={"numeric"}
            />
          </View>

          <View className="grow justify-start items-start px-2">
            <Text className="text-xs mb-1 font-bold">OVERHEAD</Text>
            <TextInput
              style={styles.input2}
              value={v_overhead}
              onChange={(e) => {
                setv_overhead(e.nativeEvent.text);
              }}
              keyboardType={"numeric"}
            />
          </View>

          <View className="grow justify-start items-start px-2 mb-4">
            <Text className="text-xs mb-1 font-bold">MARGIN</Text>
            <TextInput
              style={styles.input2}
              value={v_margin}
              onChange={(e) => {
                setv_margin(e.nativeEvent.text);
              }}
              keyboardType={"numeric"}
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
