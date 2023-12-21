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

export default function AddPurchasing({ route, navigation }) {
  const { dataDetails, item } = route.params;

  const [v_warna, setv_warna] = React.useState("");
  const [v_ukuran, setv_ukuran] = React.useState("");
  const [v_qty, setv_qty] = React.useState("");

  React.useEffect(() => {
    console.log(item);
    // if (item != null) {
    //   setv_warna(item.warna);
    //   setv_ukuran(item.ukuran);
    // }
  }, []);

  async function savePurchase() {
    console.log(dataDetails.id_batch);
    console.log(dataDetails.id_po);
    console.log(dataDetails.id_produk);
    console.log(dataDetails.supplier);
    console.log(v_warna);
    console.log(v_ukuran);
    console.log(v_qty);

    // if (v_warna === "" || v_ukuran === "" || v_qty === "") {
    //   alert("Mohon Lengkapi Semua Data");
    // } else {
    //   await axios({
    //     method: "post",
    //     url: `${BASE_URL}/purchasing/inputpurchasing`,
    //     data: {
    //       id_batch: dataDetails.id_batch,
    //       id_po: dataDetails.id_po,
    //       id_produk: dataDetails.id_produk,
    //       id_sup: dataDetails.supplier,
    //       warna: v_warna,
    //       ukuran: v_ukuran,
    //       qty: v_qty,
    //     },
    //   })
    //     .then(function (response) {
    //       alert("Success");
    //       navigation.goBack();
    //     })
    //     .catch(function (error) {
    //       alert(error);
    //     });
    // }
  }

  return (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
        <View className="grow justify-start items-start px-2 border-b pb-3 border-gray-300">
          <Text className="text-sm mb-1 font-bold">Details : </Text>
          <Text className="text-xs mb-1 font-bold">
            BATCH : {dataDetails.id_batch}
          </Text>
          <Text className="text-xs mb-1 font-bold">
            ID PO : {dataDetails.id_po}
          </Text>
          <Text className="text-xs mb-1 font-bold">
            ID PRODUCT : {dataDetails.id_produk}
          </Text>
          <Text className="text-xs mb-1 font-bold">
            SUPPLIER : {dataDetails.supplier}
          </Text>
        </View>
        {/* <View className="grow justify-start items-start px-2">
          <Text className="text-xs mb-1 font-bold">BATCH</Text>
          <TextInput
            value={dataDetails.id_batch}
            editable={false}
            style={styles.input2}
          />
        </View>

        <View className="grow justify-start items-start px-2">
          <Text className="text-xs mb-1 font-bold">ID PO</Text>
          <TextInput
            value={dataDetails.id_po}
            editable={false}
            style={styles.input2}
          />
        </View>

        <View className="grow justify-start items-start px-2">
          <Text className="text-xs mb-1 font-bold">ID PRODUCT</Text>
          <TextInput
            value={dataDetails.id_produk}
            editable={false}
            style={styles.input2}
          />
        </View>

        <View className="grow justify-start items-start px-2">
          <Text className="text-xs mb-1 font-bold">SUPPLIER</Text>
          <TextInput
            value={dataDetails.supplier}
            editable={false}
            style={styles.input2}
          />
        </View> */}

        {/* <View className="grow justify-start items-start px-2">
          <Text className="text-xs mb-1 font-bold">COLOR</Text>
          {item === null ? (
            <TextInput
              editable={true}
              style={styles.input2}
              value={v_warna}
              onChangeText={(e) => {
                setv_warna(e);
              }}
            />
          ) : (
            <TextInput value={v_warna} editable={false} style={styles.input2} />
          )}
        </View>

        <View className="grow justify-start items-start px-2">
          <Text className="text-xs mb-1 font-bold">SIZE</Text>
          {item === null ? (
            <TextInput
              editable={true}
              style={styles.input2}
              value={v_ukuran}
              onChangeText={(e) => {
                setv_ukuran(e);
              }}
            />
          ) : (
            <TextInput
              value={v_ukuran}
              editable={false}
              style={styles.input2}
            />
          )}
        </View>

        <View className="grow justify-start items-start px-2 mb-2">
          <Text className="text-xs mb-1 font-bold">Qty</Text>
          <TextInput
            editable={true}
            style={styles.input2}
            value={v_qty}
            keyboardType="number-pad"
            onChangeText={(e) => {
              setv_qty(e);
            }}
          />
        </View> */}

        <View className="flex flex-row px-1">
          <Text className="basis-1/2 text-left font-medium">
            Set stock for all variations,
          </Text>
          <Text className="basis-1/2 text-right font-bold text-red-600">
            Mass Update Stok
          </Text>
        </View>

        <View className="border-y border-gray-300">
          <View className="flex flex-row pt-1 pb-1">
            <View className="basis-1/5 h-8 justify-center">
              <Text className="text-center text-md font-bold">COLOR</Text>
            </View>
            <View className="basis-1/5 h-8 justify-center">
              <Text className="text-center text-md font-bold">SIZE</Text>
            </View>
            <View className="basis-1/5 h-8 justify-center">
              <Text className="text-center text-md font-bold">STOK</Text>
            </View>
            <View className="basis-1/5 h-8 justify-center">
              <Text className="text-center text-md font-bold">ADD STOK</Text>
            </View>
            <View className="basis-1/5 h-8 justify-center">
              <Text className="text-center text-md font-bold">TOTAL</Text>
            </View>
          </View>

          {item.map((data_items, index) => {
            return (
              <View
                key={index}
                className="flex flex-row border-t border-gray-200 pt-2 pb-2"
              >
                <View className="basis-1/5 h-8 justify-center">
                  <Text className="text-center text-md">
                    {data_items.warna}
                  </Text>
                </View>
                <View className="basis-1/5 h-8 justify-center">
                  <Text className="text-center text-md">
                    {data_items.ukuran}
                  </Text>
                </View>
                <View className="basis-1/5 h-8 justify-center">
                  <Text className="text-center text-md">
                    {data_items.stok_ready}
                  </Text>
                </View>
                <View className="basis-1/5 h-8 justify-center">
                  <TextInput
                    keyboardType="number-pad"
                    className="py-1 h-full w-[80%] mx-auto rounded-md text-center border border-gray-200"
                  />
                </View>
                <View className="basis-1/5 h-8 justify-center">
                  <Text className="text-center text-md">
                    {data_items.stok_ready}
                  </Text>
                </View>
              </View>
            );
          })}

          <View className="flex flex-row border-t border-gray-200 pt-2 pb-2">
            <View className="basis-1/4 h-8 justify-center">
              <TextInput
                placeholder="Color.."
                value={v_warna}
                onChangeText={(e) => {
                  setv_warna(e);
                }}
                className="py-1 h-full w-[80%] mx-auto rounded-md text-center border border-gray-200"
              />
            </View>
            <View className="basis-1/4 h-8 justify-center">
              <TextInput
                placeholder="Size.."
                value={v_ukuran}
                onChangeText={(e) => {
                  setv_ukuran(e);
                }}
                className="py-1 h-full w-[80%] mx-auto rounded-md text-center border border-gray-200"
              />
            </View>
            <View className="basis-1/4 h-8 justify-center">
              <TextInput
                placeholder="Stok.."
                value={v_qty}
                onChangeText={(e) => {
                  setv_qty(e);
                }}
                className="py-1 h-full w-[80%] mx-auto rounded-md text-center border border-gray-200"
              />
            </View>
            <View className="basis-1/4 h-8 justify-center">
              <TouchableOpacity
                onPress={() => {}}
                className="text-center bg-red-400 justify-center flex items-center py-2 rounded-md w-8 mx-auto"
              >
                <Ionicons name={"add"} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="grow justify-start items-start px-2 w-full pt-10 mb-12">
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              savePurchase();
            }}
          >
            <Text style={styles.text}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    // </TouchableWithoutFeedback>
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
