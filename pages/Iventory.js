import * as React from "react";
import {
  Text,
  View,
  Button,
  SafeAreaView,
  Image,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import { FlashList } from "@shopify/flash-list";

let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

let Numbering = new Intl.NumberFormat("id-ID");

const width = Dimensions.get("window").width;

export default function IventoryScreen({ navigation }) {
  const [isLodaing, setisLodaing] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  let dataItems_ = [];
  const [items, setItems] = React.useState(dataItems_);
  const [value, setValue] = React.useState("");
  const [id_batch, setid_batch] = React.useState("");

  async function getDataBatch() {
    dataItems_ = [];
    try {
      const res = await axios({
        method: "get",
        url: `${process.env.EXPO_PUBLIC_BASE_URL}/purchaseorder/getbatch`,
      });

      res.data.data.map((dtas) => {
        if (!dataItems_.find((o) => o.value === dtas.id_batch)) {
          dataItems_.push({ label: dtas.id_batch, value: dtas.id_batch });
          dataItems_.sort(function (a, b) {
            return a - b;
          });
        }
      });

      setItems(dataItems_);

      if (items.length < 1) {
        getDataProduct(res.data.data[0].id_batch);
        setValue(res.data.data[0].id_batch);
      } else {
        if (!dataItems_.find((o) => o.value === value)) {
          getDataProduct(res.data.data[0].id_batch);
          setValue(res.data.data[0].id_batch);
        }
        setisLodaing(false);
        setRefreshing(false);
      }
    } catch (error) {
      setisLodaing(false);
      setRefreshing(false);
      console.log(error);
    }
  }

  const dataItems = items.sort(function (a, b) {
    return a - b;
  });

  const [dataProduct, setdataProduct] = React.useState([]);

  function onRefreshFunc() {
    getDataBatch();
    getDataProduct(id_batch);
  }

  async function getDataProduct(data_batch) {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/iventory?id_batch=${data_batch}`
      );

      setdataProduct(res.data.data);

      setid_batch(data_batch);

      setisLodaing(false);
      setRefreshing(false);
    } catch (error) {
      setisLodaing(false);
      setRefreshing(false);
      console.log(error);
    }
  }

  React.useEffect(() => {
    setisLodaing(true);
    getDataBatch();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getDataProduct(id_batch);
      return () => {
        // console.log("heloo Again");
      };
    }, [id_batch])
  );

  const [SerachQuery, setSerachQuery] = React.useState("");

  function itemProduct(item) {
    return (
      <Pressable
        key={item.id_produk}
        onPress={() =>
          navigation.navigate("DetailProduct", {
            item,
          })
        }
        className="my-1 px-2 w-full"
      >
        <View className=" bg-white rounded-2xl shadow-sm">
          <View className="w-full aspect-square border-gray-200 border-b">
            <Image
              source={{
                uri: `${process.env.EXPO_PUBLIC_BASE_URL}/assets/img/${item.images}`,
              }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
            />
          </View>

          <View className="px-2 bg-gray-50 rounded-b-2xl">
            <View className="h-4 mt-1.5 justify-start">
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className={`${item.produk == "null" ? "text-red-500" : "text-[#2e2e2e]"
                  } font-bold text-left text-md`}
              >
                {item.produk == "null" ? "Belum ada nama" : item.produk}
              </Text>
            </View>
            {/* <Text className="text-gray-400 text-xs">{item.id_produk}</Text> */}

            <View className="mb-1">
              <Text className="text-black text-md text-left">
                <Text className="font-medium">{item.supplier}</Text>
              </Text>
            </View>

            {/* <Text className="text-black text-xs">
              Modal Produk :
              <Text className="font-bold">{Rupiah.format(item.modal_rp)}</Text>
            </Text> */}

            {/* <Text className="text-black text-xs">
              Overhead :
              <Text className="font-bold">
                {Rupiah.format(item.modal_overhead_rp)}
              </Text>
            </Text> */}

            {/* <Text className="text-black text-xs">
              Profit :
              <Text className="font-bold">{Rupiah.format(item.profit)}</Text>
            </Text> */}

            {/* <Text className="text-black text-xs">
              Harga Jual :
              <Text className="font-bold">
                {Rupiah.format(item.harga_jual)}
              </Text>
            </Text> */}

            <View className="text-xs flex flex-row">
              <View className="text-black flex flex-row text-xs ml-auto">
                <Text className="basis-1/2 font-medium text-xs">Order</Text>
              </View>

              <View className="text-black flex flex-row text-xs ml-auto">
                <Text className="font-bold basis-1/2 text-right">
                  :{" "}
                  {Numbering.format(
                    item.total_reserved === null ? 0 : item.total_reserved
                  )}
                </Text>
              </View>
            </View>

            <View className="text-xs flex flex-row">
              <View className="text-black flex flex-row text-xs ml-auto">
                <Text className="basis-1/2 font-medium text-xs  text-green-500">
                  Available
                </Text>
              </View>

              <View className="text-black flex flex-row text-xs ml-auto">
                <Text className="font-bold basis-1/2 text-right text-green-500">
                  :{" "}
                  {Numbering.format(
                    item.total_stok === null ? 0 : item.total_stok
                  )}
                </Text>
              </View>
            </View>

            <View className="text-xs flex flex-row">
              <View className="text-black flex flex-row text-xs ml-auto">
                <Text className="basis-1/2 font-medium text-xs  text-red-600">
                  Unfulfilled
                </Text>
              </View>

              <View className="text-black flex mb-2 flex-row text-xs ml-auto">
                <Text className="font-bold basis-1/2 text-right text-red-600">
                  :{" "}
                  {Numbering.format(
                    item.total_permintaan < 0 ? item.total_permintaan : 0
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  let serach_produk = dataProduct.filter(
    (item) => item.produk.toLowerCase().indexOf(SerachQuery.toLowerCase()) > -1
  );

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="mb-1 z-50 flex flex-row items-center p-4">
        <View className="basis-5/6">
          <DropDownPicker
            style={{
              borderColor: "#8EA4BB",
              paddingHorizontal: 15,
              width: "100%",
            }}
            dropDownContainerStyle={{
              paddingHorizontal: 5,
              borderColor: "#8EA4BB",
            }}
            placeholder="Pilih Batch"
            open={open}
            value={value}
            items={dataItems}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onSelectItem={(item) => {
              if (id_batch != item.value) {
                setisLodaing(true);
                setRefreshing(true);
                setid_batch(item.value);
                getDataProduct(item.value);
              }
            }}
          />
        </View>

        <View className="basis-1/6  flex flex-row justify-end">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddProduct", {
                id_batch: value,
              })
            }
            className="aspect-square w-12 flex flex-row justify-center items-center pl-1 rounded-md bg-[#D13D3D]"
          >
            <Ionicons name={"add"} size={35} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-white px-4 pb-3">
        <TextInput
          value={SerachQuery}
          placeholder="Search Product.."
          style={{
            borderWidth: 1,
            padding: 15,
            borderRadius: 5,
            borderColor: "#8EA4BB",
          }}
          onChangeText={(e) => {
            setSerachQuery(e);
          }}
        />
      </View>

      {isLodaing ? (
        <View className="h-full flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : dataProduct.length < 1 ? (
        <View className="grow flex flex-col justify-center items-center">
          <Text>Data Belum Ada, Silahkan Input Data</Text>
          <Button title="Refresh Data" onPress={onRefreshFunc} />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            width: "auto",
            paddingHorizontal: 8,
          }}
        >
          <FlashList
            estimatedItemSize={200}
            numColumns={2}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshFunc}
                colors={["blue"]}
                tintColor="red"
              />
            }
            keyExtractor={(item, index) => index.toString()}
            data={serach_produk}
            renderItem={({ item }) => itemProduct(item)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
