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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL } from "@env";

let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

let Numbering = new Intl.NumberFormat("id-ID");

export default function DashboardScreen({ navigation }) {
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
        url: `http://139.180.130.182:4000/purchaseorder/getbatch`,
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
        getDataDashboard(res.data.data[0].id_batch);
        setValue(res.data.data[0].id_batch);
      } else {
        if (!dataItems_.find((o) => o.value === value)) {
          getDataDashboard(res.data.data[0].id_batch);
          setValue(res.data.data[0].id_batch);
        }
        setisLodaing(false);
        setRefreshing(false);
      }

      setisLodaing(false);
      setRefreshing(false);
    } catch (error) {
      setisLodaing(false);
      setRefreshing(false);
      console.log(error);
    }
  }

  const dataItems = items.sort(function (a, b) {
    return a - b;
  });

  React.useEffect(() => {
    setisLodaing(true);
    getDataBatch();
  }, []);

  const [penjualan, setpenjualan] = React.useState("");
  const [total_produk, settotal_produk] = React.useState("");
  const [stok_ready, setstok_ready] = React.useState("");
  const [permintaan, setpermintaan] = React.useState("");
  const [count, setcount] = React.useState("");

  async function getDataDashboard(idBatchs) {
    try {
      const res = await axios({
        method: "get",
        url: `http://139.180.130.182:4000/purchaseorder/dashboard/${idBatchs}`,
      });

      setpenjualan(
        res.data.data.total_penjualan[0].sub_total === null
          ? 0
          : res.data.data.total_penjualan[0].sub_total
      );
      settotal_produk(res.data.data.total_produk[0].total_produk);
      setstok_ready(
        res.data.data.total_produk[0].total_stok === null
          ? 0
          : res.data.data.total_produk[0].total_stok
      );

      setpermintaan(
        res.data.data.total_penjualan[0].qty === null
          ? 0
          : res.data.data.total_penjualan[0].qty
      );

      setcount(
        res.data.data.total_penjualan[0].count === null
          ? 0
          : res.data.data.total_penjualan[0].count
      );

      setisLodaing(false);
      setRefreshing(false);
    } catch (error) {
      setisLodaing(false);
      setRefreshing(false);
      console.log(error);
    }
  }

  //   useFocusEffect(
  //     React.useCallback(() => {
  //       getDataBatch();

  //       return () => {
  //         // getDataBatch();
  //       };
  //     }, [])
  //   );

  function onRefreshFunc() {
    setRefreshing(true);
    getDataBatch();
    getDataDashboard(value);
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex flex-row items-center py-2 mb-2 px-5">
        <Text className="grow text-xl font-bold ">CE APPS</Text>

        <View className="justify-end flex flex-row">
          <Image
            source={require("../public/avatar.png")}
            style={{
              width: 45,
              height: 45,
              resizeMode: "contain",
              borderRadius: 10,
            }}
          />
        </View>
      </View>

      <DropDownPicker
        style={{
          borderColor: "#8EA4BB",
          paddingHorizontal: 15,
        }}
        containerStyle={{
          marginBottom: 15,
          marginHorizontal: 15,
          width: "auto",
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
          setid_batch(item.value);

          setisLodaing(true);
          getDataDashboard(item.value);
        }}
      />

      {isLodaing ? (
        <View className="h-full flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefreshFunc}
              colors={["blue"]}
              tintColor="red"
            />
          }
        >
          {/* Card1 */}
          <View className="bg-gray-100 h-32 rounded-lg flex flex-row p-4 mx-4 mb-2">
            <View className="grow text-center items-start justify-center flex flex-col">
              <View>
                <Text className="font-bold text-lg">Ringkasan Penjualan</Text>
              </View>

              <View className="grow flex flex-row space-x-3 items-center">
                <View className="text-center items-center justify-center">
                  <Image
                    source={require("../public/money.png")}
                    style={{
                      width: 30,
                      height: 30,
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <Text className="font-bold text-2xl">
                  {Rupiah.format(penjualan)}
                </Text>
              </View>

              <View>
                <Text className="font-medium text-sm">
                  Total {Numbering.format(count)} Pesanan
                </Text>
              </View>
            </View>
          </View>
          {/* Card1 */}
          {/* Card2 */}
          <View className="flex flex-row mb-2 space-x-2 items-center justify-center px-5">
            <View className="bg-gray-100 h-16 rounded-lg flex flex-row space-x-3 basis-1/2 px-4">
              <View className="text-center items-center justify-center">
                <Image
                  source={require("../public/product.png")}
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View className="grow text-center items-start justify-center flex flex-col">
                <Text className="font-bold">Total Produk</Text>
                <Text>{total_produk}</Text>
              </View>
            </View>

            <View className="bg-gray-100 h-16 rounded-lg flex flex-row space-x-3 basis-1/2 px-4">
              <View className="text-center items-center justify-center">
                <Image
                  source={require("../public/requested.png")}
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View className="grow text-center items-start justify-center flex flex-col">
                <Text className="font-bold">Permintaan Stok</Text>
                <Text>{Numbering.format(permintaan)} Qty</Text>
              </View>
            </View>
          </View>
          {/* Card2 */}
          {/* Card3 */}
          <View className="flex flex-row mb-2 space-x-2 items-center justify-center px-5">
            <View className="bg-gray-100 h-16 rounded-lg flex flex-row space-x-3 basis-1/2 px-4">
              <View className="text-center items-center justify-center">
                <Image
                  source={require("../public/instock.png")}
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View className="grow text-center items-start justify-center flex flex-col">
                <Text className="font-bold">Stok Tersedia</Text>
                <Text>{Numbering.format(stok_ready)} Qty</Text>
              </View>
            </View>

            <View className="bg-gray-100 h-16 rounded-lg flex flex-row space-x-3 basis-1/2 px-4">
              <View className="text-center items-center justify-center">
                <Image
                  source={require("../public/reserved.png")}
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View className="grow text-center items-start justify-center flex flex-col">
                <Text className="font-bold">Belum terpenuhi</Text>
                <Text>{Numbering.format(stok_ready - permintaan)} Qty</Text>
              </View>
            </View>
          </View>
          {/* Card3 */}
          {/* <Text>{JSON.stringify(data)}</Text> */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
