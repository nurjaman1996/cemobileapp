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
        className="h-[80%]"
      >
        <View className="-mb-5">
          <View className="aspect-square">
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
        </View>

        <View className="-mt-5 -mb-5 z-50 bg-green-600 w-[50%] mx-auto rounded-full p-2 flex items-center">
          <Text className="font-bold text-xl text-white">
            Available Stock{" : "}
            {Numbering.format(
              dataDetails.item.total_stok === null
                ? 0
                : dataDetails.item.total_stok
            )}
          </Text>
        </View>

        <View className="border border-gray-300 border-b-0 pt-3 rounded-t-3xl bg-white">
          <View className="mx-4 flex-row items-center h-auto border-b border-gray-300 py-2  ">
            <View className="basis-3/4">
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className={`${
                  dataDetails.item.produk == "null"
                    ? "text-red-500"
                    : "text-[#2e2e2e]"
                } font-bold text-xl `}
              >
                {dataDetails.item.produk == "null"
                  ? "Belum ada nama"
                  : dataDetails.item.produk}
              </Text>
              <Text className="font-medium text-xs text-red-500">
                {dataDetails.item.id_produk}
              </Text>
              <Text className="font-bold text-xs">
                {dataDetails.item.supplier}
              </Text>
            </View>

            <Text className="basis-1/4 pt-1 font-bold text-md text-right">
              {Rupiah.format(dataDetails.item.harga_jual)}{" "}
              <Text className="text-xs  text-red-500">
                {dataDetails.item.berat_produk}Gr
              </Text>
            </Text>
          </View>

          <View className="flex flex-row mx-4 py-2 px-0 border-b  border-gray-300">
            <View className="basis-1/2 flex flex-row items-start h-auto ">
              <View className="basis-1/2 ">
                {/* <Text className="text-black text-xs">
                Supplier
              </Text> */}
                <Text className="text-black text-xs">Cost Kurs</Text>
                <Text className="text-black text-xs">Cost</Text>
                <Text className="text-black text-xs">Overhead</Text>
                {/* <Text className="text-black text-xs">
                Selling Price
              </Text> */}
                <Text className="text-black text-xs">Profit</Text>
              </View>
              <View className="basis-1/2 ">
                {/* <Text className="font-bold text-xs text-right">{dataDetails.item.supplier}</Text> */}
                <Text className="font-bold text-xs text-right">
                  {dataDetails.item.modal_asing}
                </Text>
                <Text className="font-bold text-xs text-right">
                  {Rupiah.format(dataDetails.item.modal_rp)}
                </Text>
                <Text className="font-bold text-xs text-right">
                  {Rupiah.format(dataDetails.item.modal_overhead_rp)}
                </Text>
                {/* <Text className="font-bold text-xs text-right">{Rupiah.format(dataDetails.item.harga_jual)}</Text> */}
                <Text className="font-bold text-xs text-right">
                  {Rupiah.format(dataDetails.item.profit)}
                </Text>
              </View>
            </View>

            <View className="basis-1/2 flex flex-row items-start h-auto mx-4 px-0">
              <View className="basis-1/2">
                <Text className="text-black text-xs">KURS</Text>
                <Text className="text-black text-xs">OVERHEAD</Text>
                <Text className="text-black text-xs">MARGIN</Text>
              </View>
              <View className="basis-1/2 px-3">
                <Text className="font-bold text-xs text-right">
                  {Rupiah.format(dataDetails.item.kurs)}
                </Text>
                <Text className="font-bold text-xs text-right">
                  {Rupiah.format(dataDetails.item.overhead)}
                </Text>
                <Text className="font-bold text-xs text-right">
                  {dataDetails.item.margin}%
                </Text>
              </View>
            </View>
          </View>

          <View className="flex flex-row px-0 mr-4 mx-4 mt-2 h-[35px] justify-center">
            <View className="basis-2/5 h-auto m-1 bg-black rounded-md shadow-sm ">
              <Text className="font-bold text-md text-white text-center mt-1.5">
                Orders{" : "}
                {Numbering.format(
                  dataDetails.item.total_reserved === null
                    ? 0
                    : dataDetails.item.total_reserved
                )}
              </Text>
            </View>
            <View className="basis-2/5 h-auto m-1 bg-red-600 rounded-md shadow-sm">
              <Text className="font-bold text-md text-white text-center mt-1.5">
                Unfulfilled{" : "}
                {Numbering.format(
                  dataDetails.item.total_permintaan === null
                    ? 0
                    : dataDetails.item.total_permintaan
                )}
              </Text>
            </View>
          </View>
        </View>
        <Modal
          className="bg-black"
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View
              style={styles.modalView}
              className=" bg-cyan-300 rounded-3xl border-t border-gray-200 shadow-md"
            >
              <View className="w-full h-[70%] px-4 pb-4 pt-2">
                <View className="flex flex-row items-center justify-start mb-2 px-4">
                  <Text className="text-center text-xl font-bold">
                    VARIATIONS
                  </Text>

                  <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    className="ml-auto px-3 py-2 rounded-md"
                  >
                    <Text className="text-blue-500 underline font-bold text-center text-sm">
                      Back
                    </Text>
                  </TouchableOpacity>
                </View>
                {data_variasi.length < 1 ? (
                  <View className="flex-1 items-center justify-center">
                    <Text className="basis-1/12 text-center">
                      There are no variations yet, please add variations and
                      stock
                    </Text>
                  </View>
                ) : (
                  <>
                    {/* <View className="bg-white p-2 shadow-sm mt-4">
                      <View className="flex flex-row border-b border-gray-200 pb-2 mt-1 ml-1">
                        <Text className="basis-1/2 text-left font-medium">
                          VARIATION
                        </Text>
                        <Text className="basis-1/2 text-right font-medium text-red-600">
                          Change
                        </Text>
                      </View>

                      <View className="flex flex-row border-b border-gray-200 pb-2 mb-2 ml-1">
                        <View className="basis-full flex flex-row bg-cy">
                          <View className="basis-grow text-left p-3 mt-2  border rounded-md border-red-600 mr-2">
                            <Text className="font-medium  text-red-600">
                              Navy
                            </Text>
                          </View>
                          <View className="basis-grow text-left p-3 mt-2  border rounded-md border-red-600 mr-2">
                            <Text className="font-medium  text-red-600">
                              Black
                            </Text>
                          </View>
                          <View className="basis-grow text-left p-3 mt-2  border rounded-md border-red-600 mr-2">
                            <Text className="font-medium">+ Add</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View className="bg-white p-2 shadow-sm mt-4">
                      <View className="flex flex-row border-b border-gray-200 pb-2 mt-1 ml-1">
                        <Text className="basis-1/2 text-left font-medium">
                          SIZE
                        </Text>
                        <Text className="basis-1/2 text-right font-medium text-red-600">
                          Change
                        </Text>
                      </View>

                      <View className="flex flex-row border-b border-gray-200 pb-2 mb-2 ml-1">
                        <View className="basis-full flex flex-row bg-cy">
                          <View className="basis-grow text-left p-3 mt-2  border rounded-md border-red-600 mr-2">
                            <Text className="font-medium  text-red-600">M</Text>
                          </View>
                          <View className="basis-grow text-left p-3 mt-2  border rounded-md border-red-600 mr-2">
                            <Text className="font-medium  text-red-600">L</Text>
                          </View>
                          <View className="basis-grow text-left p-3 mt-2  border rounded-md border-red-600 mr-2">
                            <Text className="font-medium  text-red-600">
                              XL
                            </Text>
                          </View>
                          <View className="basis-grow text-left p-3 mt-2  border rounded-md border-red-600 mr-2">
                            <Text className="font-medium">+ Add</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row justify-center items-center rounded-md h-10 mb-2 px-2 border-b border-t border-gray-300">
                      <Text className="basis-1/12 text-center text-xs">
                        NO.
                      </Text>
                      <Text className="basis-2/12 text-center text-xs">
                        COLOR
                      </Text>
                      <Text className="basis-2/12 text-center text-xs">
                        SIZE
                      </Text>
                      <Text className="basis-2/12 text-center text-xs">
                        AVAILABLE
                      </Text>
                    </View> */}

                    <View className="flex-row justify-center items-center rounded-md h-10 mb-2 px-2 border-b border-t border-gray-300">
                      <Text className="basis-1/12 text-center text-xs">
                        NO.
                      </Text>
                      <Text className="basis-2/12 text-center text-xs">
                        COLOR
                      </Text>
                      <Text className="basis-2/12 text-center text-xs">
                        SIZE
                      </Text>
                      <Text className="basis-2/12 text-center text-xs">
                        AVAILABLE
                      </Text>
                      <Text className="basis-2/12 text-center text-xs">
                        ORDER
                      </Text>
                      <Text className="basis-2/12 text-center text-xs">
                        SISA
                      </Text>
                      <Text className="basis-1/12 text-center text-xs">
                        ACT
                      </Text>
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
                  className="basis-1/2 bg-red-600 px-3 py-2 rounded-md"
                >
                  <Text className="text-white font-bold text-center text-sm">
                    Edit Stock
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    navigation.navigate("AddPurchasing", {
                      dataDetails: dataDetails.item,
                      item: null,
                    });
                  }}
                  className="basis-1/2 bg-red-600 px-3 py-2 rounded-md"
                >
                  <Text className="text-white font-bold text-center text-sm">
                    Add New Variations
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
      </ScrollView>
      <TouchableOpacity
        onPress={() => getVariasi()}
        className="mx-3 bg-red-600 px-4 py-3 rounded-lg my-3 justify-items-end"
      >
        <Text className="text-white font-bold text-center text-base">
          View Stock Details
        </Text>
      </TouchableOpacity>
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
