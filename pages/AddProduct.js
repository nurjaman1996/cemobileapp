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
import { BASE_URL } from "@env";
import * as ImagePicker from "expo-image-picker";
import { Pressable } from "react-native";
let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

let Numbering = new Intl.NumberFormat("id-ID");

export default function DetailPage({ route, navigation }) {
  const { id_batch } = route.params;
  const [openPo, setOpenPo] = React.useState(false);
  const [openSup, setOpenSup] = React.useState(false);
  const [v_idpo, setv_idpo] = React.useState("");
  const [v_sup, setv_sup] = React.useState("");
  const [v_namesup, setv_namesup] = React.useState("");

  const [ListPo, setListPo] = React.useState([]);
  const [ListSup, setListSup] = React.useState([]);

  async function getListPo() {
    try {
      const res = await axios({
        method: "get",
        url: `${BASE_URL}/purchaseorder/getpobybatch/${id_batch}`,
      });

      res.data.data.map((dtas) => {
        if (!ListPo.find((o) => o.value === dtas.id_po)) {
          ListPo.push({
            label: dtas.id_po,
            value: dtas.id_po,
            kurs: dtas.kurs,
            overhead: dtas.overhead_gr,
            margin: dtas.margin,
          });
          ListPo.sort(function (a, b) {
            return a - b;
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getListSup() {
    try {
      const res = await axios({
        method: "get",
        url: `${BASE_URL}/supplier`,
      });

      res.data.data.map((dtas) => {
        if (!ListSup.find((o) => o.value === dtas.id_sup)) {
          ListSup.push({
            label: dtas.supplier,
            value: dtas.id_sup,
            contact: dtas.contact,
            alamat: dtas.alamat,
          });
          ListSup.sort(function (a, b) {
            return a - b;
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getListPo();
      getListSup();

      return () => {
        // console.log("heloo Again");
      };
    }, [])
  );

  const [v_kurs, setv_kurs] = React.useState("0");
  const [v_overhead, setv_overhead] = React.useState("0");
  const [v_margin, setv_margin] = React.useState("0");
  const [v_modalasing, setv_modalasing] = React.useState(null);
  const [v_produk, setv_produk] = React.useState(null);
  const [v_beratproduk, setv_beratproduk] = React.useState(null);
  const [v_file, setv_file] = React.useState(null);

  const [r_overhead, setr_overhead] = React.useState("0");
  const [r_profit, setr_profit] = React.useState("0");
  const [r_price, setr_price] = React.useState("0");

  const [disabledForm, setdisabledForm] = React.useState(false);

  async function saveIventory() {
    // console.log(id_batch);
    // console.log(v_idpo);
    // console.log(v_kurs);
    // console.log(v_margin);
    // console.log(v_overhead);
    // console.log(v_namesup);
    // console.log(v_sup);
    // console.log(v_modalasing);
    // console.log(v_beratproduk);
    // console.log(v_file);

    if (
      id_batch === "" ||
      v_idpo === "" ||
      v_kurs === "0" ||
      v_margin === "0" ||
      v_overhead === "0" ||
      v_namesup === "" ||
      v_sup === "" ||
      v_modalasing === null ||
      v_beratproduk === null ||
      v_file === null
    ) {
      alert("Lengkapi Data");
    } else {
      let formData = new FormData();
      formData.append("id_batch", id_batch);
      formData.append("id_po", v_idpo);
      formData.append("kurs", v_kurs);
      formData.append("overhead", v_overhead);
      formData.append("margin", v_margin);
      formData.append("modal_asing", v_modalasing);
      formData.append("produk", v_produk);
      formData.append("berat_produk", v_beratproduk);
      formData.append("id_sup", v_sup);
      formData.append("supplier", v_namesup);
      formData.append("file", v_file);

      setdisabledForm(true);

      await axios({
        method: "post",
        url: `${BASE_URL}/iventory`,
        headers: {
          "content-type": "multipart/form-data",
        },
        data: formData,
      })
        .then(function (response) {
          alert("Input Iventory Sukes");
          setr_overhead(String(response.data.data.modal_overhead_rp));
          setr_profit(String(response.data.data.net_profit));
          setr_price(String(response.data.data.harga_jual_up));
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
              setModalVisible(true);
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
                source={require("../public/uploading.png")}
                style={{
                  width: "80%",
                  height: "80%",
                  resizeMode: "contain",
                  borderRadius: 10,
                }}
              />
            )}
          </Pressable>

          <View className="basis-1/2 space-y-2">
            <View className="grow justify-start px-2">
              <TextInput
                value={id_batch}
                editable={false}
                style={styles.input}
              />
            </View>

            <View className="grow justify-end px-2 z-50">
              <Text className="text-xs mb-1">ID PO</Text>
              <View className="flex flex-row items-center">
                <View className="w-[70%]">
                  <DropDownPicker
                    disabled={disabledForm}
                    style={{
                      borderColor: "#8EA4BB",
                      backgroundColor: "white",
                    }}
                    dropDownContainerStyle={{
                      borderColor: "#8EA4BB",
                      backgroundColor: "white",
                    }}
                    placeholder="Select PO"
                    open={openPo}
                    value={v_idpo}
                    items={ListPo}
                    setOpen={setOpenPo}
                    setValue={setv_idpo}
                    onSelectItem={(item) => {
                      setv_kurs(String(item.kurs));
                      setv_overhead(String(item.overhead));
                      setv_margin(String(item.margin));
                    }}
                  />
                </View>

                <View className="grow flex flex-row justify-end">
                  <TouchableOpacity
                    disabled={disabledForm}
                    onPress={() =>
                      navigation.navigate("AddPo", {
                        id_batch: id_batch,
                      })
                    }
                    className="aspect-square w-12 flex flex-row justify-center items-center pl-1 rounded-md bg-[#D13D3D]"
                  >
                    <Ionicons name={"add"} size={35} color={"white"} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="grow justify-end px-2">
              <Text className="text-xs mb-1">SUPPLIER</Text>
              <View className="flex flex-row items-center">
                <View className="w-[70%]">
                  <DropDownPicker
                    disabled={disabledForm}
                    style={{
                      borderColor: "#8EA4BB",
                      backgroundColor: "white",
                    }}
                    dropDownContainerStyle={{
                      borderColor: "#8EA4BB",
                      backgroundColor: "white",
                    }}
                    placeholder="Select Sup"
                    open={openSup}
                    value={v_sup}
                    items={ListSup}
                    setOpen={setOpenSup}
                    setValue={setv_sup}
                    onSelectItem={(item) => {
                      setv_namesup(item.label);
                    }}
                  />
                </View>

                <View className="grow flex flex-row justify-end">
                  <TouchableOpacity
                    disabled={disabledForm}
                    onPress={() => navigation.navigate("AddSup")}
                    className="aspect-square w-12 flex flex-row justify-center items-center pl-1 rounded-md bg-[#D13D3D]"
                  >
                    <Ionicons name={"add"} size={35} color={"white"} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="flex flex-row text-center px-1 -z-10">
          <View className="basis-1/3 justify-center items-center px-2">
            <Text className="text-xs mb-1">KURS</Text>
            <TextInput
              value={Numbering.format(v_kurs)}
              editable={false}
              style={styles.input2}
            />
          </View>

          <View className="basis-1/3 justify-center items-center px-2">
            <Text className="text-xs mb-1">OVERHEAD</Text>
            <TextInput
              value={Numbering.format(v_overhead)}
              editable={false}
              style={styles.input2}
            />
          </View>

          <View className="basis-1/3 justify-center items-center px-2">
            <Text className="text-xs mb-1">MARGIN</Text>
            <TextInput
              value={Numbering.format(v_margin)}
              editable={false}
              style={styles.input2}
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
            value={v_modalasing}
            onChange={(e) => {
              setv_modalasing(e.nativeEvent.text);
            }}
            keyboardType={"numeric"}
          />
        </View>

        <View className="px-3 mt-4 mb-4  -z-10">
          <Text className="text-xs mb-1">Weight Product</Text>
          <TextInput
            placeholder="Insert Product Weight"
            editable={!disabledForm}
            style={styles.input2}
            value={v_beratproduk}
            onChange={(e) => {
              setv_beratproduk(e.nativeEvent.text);
            }}
            keyboardType={"numeric"}
          />
        </View>

        <View className="mt-5 mb-8 justify-start items-start px-2 w-full">
          <TouchableOpacity
            disabled={disabledForm}
            style={disabledForm ? styles.buttonDisabled : styles.button}
            onPress={() => {
              saveIventory();
            }}
          >
            <Text style={styles.text}>Save</Text>
          </TouchableOpacity>
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
