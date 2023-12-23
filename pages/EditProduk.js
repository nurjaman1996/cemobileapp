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
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Pressable } from "react-native";
let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

let Numbering = new Intl.NumberFormat("id-ID");

export default function DetailPage({ route, navigation }) {
  const { data } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      setv_kurs(data.kurs);
      setv_overhead(data.overhead);
      setv_margin(data.margin);
      setv_modalasing(data.modal_asing);
      setv_produk(data.produk);
      setv_beratproduk(data.berat_produk);

      setr_overhead(data.modal_overhead_rp);
      setr_profit(data.profit);
      setr_price(data.harga_jual);
      return () => {
        // console.log("heloo Again");
      };
    }, [])
  );

  const [v_kurs, setv_kurs] = React.useState("0");
  const [v_overhead, setv_overhead] = React.useState("0");
  const [v_margin, setv_margin] = React.useState("0");
  const [v_modalasing, setv_modalasing] = React.useState("");
  const [v_produk, setv_produk] = React.useState("");
  const [v_beratproduk, setv_beratproduk] = React.useState("");
  const [v_file, setv_file] = React.useState(null);

  const [r_overhead, setr_overhead] = React.useState("0");
  const [r_profit, setr_profit] = React.useState("0");
  const [r_price, setr_price] = React.useState("0");

  const [disabledForm, setdisabledForm] = React.useState(false);

  async function updateIventory() {
    // console.log(data.id_produk);
    // console.log(data.id_batch);
    // console.log(data.id_po);
    // console.log(v_kurs);
    // console.log(v_overhead);
    // console.log(v_margin);
    // console.log(v_modalasing);
    // console.log(v_beratproduk);
    // console.log(v_produk);
    // console.log(v_file);
    if (
      v_kurs === "0" ||
      v_margin === "0" ||
      v_overhead === "0" ||
      v_modalasing === null ||
      v_beratproduk === null
    ) {
      alert("Lengkapi Data");
    } else {
      let formData = new FormData();
      formData.append("id_produk", data.id_produk);
      formData.append("id_batch", data.id_batch);
      formData.append("id_po", data.id_po);
      formData.append("kurs", v_kurs);
      formData.append("overhead", v_overhead);
      formData.append("margin", v_margin);
      formData.append("modal_asing", v_modalasing);
      formData.append("berat_produk", v_beratproduk);
      formData.append("produk", v_produk);
      formData.append("deleteimage", "");
      if (v_file != null) {
        formData.append("file", v_file);
      } else {
        formData.append("file", "");
      }

      setdisabledForm(true);
      await axios({
        method: "post",
        url: `${process.env.EXPO_PUBLIC_BASE_URL}/dekstop/editproduk`,
        headers: {
          "content-type": "multipart/form-data",
        },
        data: formData,
      })
        .then(function (response) {
          alert("Update Iventory Sukes");
          navigation.navigate("MainTab");
        })
        .catch(function (error) {
          setdisabledForm(false);
          console.log(error);
        });
    }
  }

  const [image, setImage] = React.useState(null);

  const [modalVisible, setModalVisible] = React.useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      delete result.cancelled;
      setImage(result.assets[0].uri);

      let localUri = result.assets[0].uri;
      let filename = localUri.split("/").pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      setv_file({ uri: localUri, name: filename, type });

      setModalVisible(false);
    }
  };

  const pickImageCamera = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      delete result.cancelled;
      setImage(result.assets[0].uri);

      let localUri = result.assets[0].uri;
      let filename = localUri.split("/").pop();

      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      setv_file({ uri: localUri, name: filename, type });

      setModalVisible(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView className="bg-white flex-1 h-full">
        <View className="p-4 flex-row space-x-2 justify-center items-center">
          <Pressable
            disabled={disabledForm}
            onPress={() => {
              if (image != null) {
                setImage(null);
                setv_file(null);
              } else {
                setModalVisible(true);
              }
            }}
            className="basis-1/2 aspect-square border flex justify-center items-center rounded-lg border-[#8EA4BB]"
          >
            {image != null ? (
              <Image
                source={{ uri: image }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                  borderRadius: 10,
                }}
              />
            ) : (
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_BASE_URL}/assets/img/${data.images}`,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                  borderRadius: 10,
                }}
              />
            )}
          </Pressable>
        </View>

        <View className="flex flex-row text-center px-1 -z-10">
          <View className="basis-1/3 justify-center items-center px-2">
            <Text className="text-xs mb-1">KURS</Text>
            <TextInput
              defaultValue={`${v_kurs}`}
              onChangeText={(e) => {
                setv_kurs(e);
              }}
              style={styles.input2}
              keyboardType={"numeric"}
            />
          </View>

          <View className="basis-1/3 justify-center items-center px-2">
            <Text className="text-xs mb-1">OVERHEAD</Text>
            <TextInput
              defaultValue={`${v_overhead}`}
              onChangeText={(e) => {
                setv_overhead(e);
              }}
              style={styles.input2}
              keyboardType={"numeric"}
            />
          </View>

          <View className="basis-1/3 justify-center items-center px-2">
            <Text className="text-xs mb-1">MARGIN</Text>
            <TextInput
              defaultValue={`${v_margin}`}
              onChangeText={(e) => {
                setv_margin(e);
              }}
              style={styles.input2}
              keyboardType={"numeric"}
            />
          </View>
        </View>

        <View className="px-3 mt-5  -z-10">
          <Text className="text-xs mb-1">Name Product (OPTIONAL)</Text>
          <TextInput
            placeholder="Insert Name Product.."
            editable={!disabledForm}
            style={styles.input2}
            value={v_produk}
            onChange={(e) => {
              setv_produk(e.nativeEvent.text);
            }}
            keyboardType={"default"}
          />
        </View>

        <View className="px-3 mt-5  -z-10">
          <Text className="text-xs mb-1">Costs (KURS FOREIGN)</Text>
          <TextInput
            placeholder="Insert Cost.."
            editable={!disabledForm}
            style={styles.input2}
            defaultValue={`${v_modalasing}`}
            onChangeText={(e) => {
              setv_modalasing(e);
            }}
            keyboardType={"numeric"}
          />
        </View>

        <View className="px-3 mt-4 mb-8 -z-10">
          <Text className="text-xs mb-1">Weight Product</Text>
          <TextInput
            placeholder="Insert Product Weight"
            editable={!disabledForm}
            style={styles.input2}
            defaultValue={`${v_beratproduk}`}
            onChangeText={(e) => {
              setv_beratproduk(e);
            }}
            keyboardType={"numeric"}
          />
        </View>

        <View className="flex flex-row text-center px-1 -z-10">
          <View className="basis-1/3 justify-center items-center px-2">
            <Text className="text-xs mb-1 font-bold">RESULT OVERHEAD</Text>
            <TextInput
              value={Rupiah.format(r_overhead)}
              editable={false}
              style={styles.input2}
            />
          </View>

          <View className="basis-1/3 justify-center items-center px-2">
            <Text className="text-xs mb-1 font-bold">PROFIT</Text>
            <TextInput
              value={Rupiah.format(r_profit)}
              editable={false}
              style={styles.input2}
            />
          </View>

          <View className="basis-1/3 justify-center items-center px-2">
            <Text className="text-xs mb-1 font-bold ">SELLING PRICE</Text>
            <TextInput
              value={Rupiah.format(r_price)}
              editable={false}
              style={styles.input2}
            />
          </View>
        </View>

        <View className="mt-8 justify-start items-start px-2 w-full">
          <TouchableOpacity
            disabled={disabledForm}
            style={disabledForm ? styles.buttonDisabled : styles.button}
            onPress={() => {
              updateIventory();
            }}
          >
            <Text style={styles.text}>Update</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slider"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity
            style={styles.centeredView}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          ></TouchableOpacity>
          <View style={styles.modalView} className="flex flex-col gap-2">
            <TouchableOpacity
              style={disabledForm ? styles.buttonDisabled : styles.button}
              onPress={() => {
                pickImageCamera();
              }}
            >
              <Text style={styles.text}>Take Photo From Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={disabledForm ? styles.buttonDisabled : styles.button}
              onPress={() => {
                pickImage();
              }}
            >
              <Text style={styles.text}>Take Photo From Gallery</Text>
            </TouchableOpacity>
          </View>
        </Modal>
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

  buttonDisabled: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    width: "100%",
    backgroundColor: "#DEDEDE",
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

  centeredView: {
    backgroundColor: "white",
    opacity: 0.5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
  },
});
