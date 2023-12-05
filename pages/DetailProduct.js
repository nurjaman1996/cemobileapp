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
  Modal,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { BASE_URL } from "@env";
import { FlashList } from "@shopify/flash-list";

let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

let Numbering = new Intl.NumberFormat("id-ID");

export default function AddPo({ route, navigation }) {
  const dataDetails = route.params;

  React.useEffect(() => {
    // console.log(dataDetails);
  }, []);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [data_variasi, setdata_variasi] = React.useState([]);

  async function getVariasi() {
    axios
      .get(
        `http://139.180.130.182:4000/variasi/getvariasi/${dataDetails.item.id_produk}`
      )
      .then(function (response) {
        setdata_variasi(response.data.data);
        setModalVisible(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function itemProduct(item, index) {
    return (
      <View className="flex-row justify-center items-center rounded-md border border-gray-400 h-10 mb-2 px-2">
        <Text className="basis-1/12 text-center">{index + 1}.</Text>
        <Text className="basis-2/12 text-center">{item.warna}</Text>
        <Text className="basis-2/12 text-center">{item.ukuran}</Text>
        <Text className="basis-2/12 text-center font-bold">
          {Numbering.format(item.stok_ready)}
        </Text>
        <Text className="basis-2/12 text-center font-bold">
          {Numbering.format(item.stok_dipesan)}
        </Text>
        <Text className="basis-2/12 text-center font-bold">
          {Numbering.format(item.stok_ready - item.stok_dipesan)}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(!modalVisible);
            navigation.navigate("AddPurchasing", {
              dataDetails: dataDetails.item,
              item: item,
            });
          }}
          className="basis-1/12 text-center bg-red-400 justify-center flex items-center py-2 rounded-md"
        >
          <Ionicons name={"add"} color={"white"} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
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
        className="h-full"
      >
        <View className="aspect-square rounded-b-md">
          <Image
            source={{
              uri: `http://139.180.130.182:4000/assets/img/${dataDetails.item.images}`,
            }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
            }}
          />
        </View>

        <View className="-mt-4 bg-red-500 w-[50%] mx-auto rounded-xl p-2 flex items-center">
          <Text className="font-bold text-base text-white">
            Total Stok :{" "}
            {Numbering.format(
              dataDetails.item.total_stok === null
                ? 0
                : dataDetails.item.total_stok
            )}
          </Text>
        </View>

        <View className="mx-4 flex-row items-center h-auto border-b border-gray-300 py-2">
          <View className="basis-3/4">
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              className={`${
                dataDetails.item.produk == "null"
                  ? "text-red-500"
                  : "text-[#2e2e2e]"
              } font-bold text-sm`}
            >
              {dataDetails.item.produk == "null"
                ? "Belum ada nama"
                : dataDetails.item.produk}
            </Text>
            <Text className="font-bold text-xs text-red-500">
              {dataDetails.item.id_produk}
            </Text>
          </View>

          <Text className="basis-1/4 pt-1 font-bold text-base text-red-500 text-center">
            {Rupiah.format(dataDetails.item.harga_jual)}
          </Text>
        </View>

        <View className="flex-row">
          <View className="mx-4 items-start h-auto py-2">
            <Text className="text-black text-xs">
              Supplier :{" "}
              <Text className="font-bold">{dataDetails.item.supplier}</Text>
            </Text>

            <Text className="text-black text-xs">
              Modal Produk Asing :
              <Text className="font-bold">
                {Numbering.format(dataDetails.item.modal_asing)}
              </Text>
            </Text>

            <Text className="text-black text-xs">
              Modal Produk Rupiah :
              <Text className="font-bold">
                {Rupiah.format(dataDetails.item.modal_rp)}
              </Text>
            </Text>

            <Text className="text-black text-xs">
              Overhead :
              <Text className="font-bold">
                {Rupiah.format(dataDetails.item.modal_overhead_rp)}
              </Text>
            </Text>

            <Text className="text-black text-xs">
              Profit :
              <Text className="font-bold">
                {Rupiah.format(dataDetails.item.profit)}
              </Text>
            </Text>

            <Text className="text-black text-xs">
              Harga Jual :
              <Text className="font-bold">
                {Rupiah.format(dataDetails.item.harga_jual)}
              </Text>
            </Text>
          </View>

          <View className="mx-4 items-end h-auto py-2 ml-auto">
            <Text className="text-black text-xs">
              KURS :{" "}
              <Text className="font-bold">
                {Rupiah.format(dataDetails.item.kurs)}
              </Text>
            </Text>

            <Text className="text-black text-xs">
              OVERHEAD :
              <Text className="font-bold">
                {Rupiah.format(dataDetails.item.overhead)}
              </Text>
            </Text>

            <Text className="text-black text-xs">
              MARGIN :
              <Text className="font-bold">{dataDetails.item.margin}%</Text>
            </Text>
          </View>
        </View>

        <Modal
          className="bg-black"
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View className="w-full h-[70%] p-4">
                {data_variasi.length < 1 ? (
                  <View className="flex-1 items-center justify-center">
                    <Text className="basis-1/12 text-center">
                      Variasi belum ada , Silahkan Tambahkan Variasi dan Stok
                    </Text>
                  </View>
                ) : (
                  <>
                    <View className="flex-row justify-center items-center rounded-md h-10 mb-2 px-2">
                      <Text className="basis-1/12 text-center">No.</Text>
                      <Text className="basis-2/12 text-center">WARNA</Text>
                      <Text className="basis-2/12 text-center">UKURAN</Text>
                      <Text className="basis-2/12 text-center">QTY READY</Text>
                      <Text className="basis-2/12 text-center">
                        QTY DIPESAN
                      </Text>
                      <Text className="basis-2/12 text-center">SISA</Text>
                      <Text className="basis-1/12 text-center">Act</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <FlashList
                        estimatedItemSize={200}
                        keyExtractor={(item, index) => index.toString()}
                        data={data_variasi}
                        renderItem={({ item, index }) =>
                          itemProduct(item, index)
                        }
                      />
                    </View>
                  </>
                )}
              </View>

              <View className="w-full flex-row space-x-2 justify-center px-4">
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    navigation.navigate("AddPurchasing", {
                      dataDetails: dataDetails.item,
                      item: null,
                    });
                  }}
                  className="basis-2/3 bg-red-500 px-3 py-2 rounded-md"
                >
                  <Text className="text-white font-bold text-center text-sm">
                    Tambah Variasi dan Stok Baru
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  className="grow bg-gray-500 px-3 py-2 rounded-md"
                >
                  <Text className="text-white font-bold text-center text-sm">
                    Kembali
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* <TouchableOpacity onPress={() => getVariasi()} className="px-4 mt-5">
          <Text className="text-blue-500 font-medium text-base underline">
            Lihat Details Stok
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => getVariasi()}
          className="mx-3 bg-red-500 px-4 py-3 rounded-lg mt-10"
        >
          <Text className="text-white font-bold text-center text-base">
            Lihat Detail Stok
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    alignItems: "center",
    width: "100%",
    height: "50%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});