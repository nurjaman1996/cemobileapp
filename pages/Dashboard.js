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
import { BarChart } from "react-native-gifted-charts";

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
        url: `${process.env.EXPO_PUBLIC_BASE_URL}/purchaseorder/dashboard/${idBatchs}`,
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

  const barData = [
    { value: 230, label: "Mon", frontColor: "#D13D3D" },
    { value: 180, label: "Tue", frontColor: "#D13D3D" },
    { value: 195, label: "Wed", frontColor: "#D13D3D" },
    { value: 250, label: "Thur", frontColor: "#D13D3D" },
    { value: 320, label: "Fri", frontColor: "#D13D3D" },
    { value: 320, label: "Sat", frontColor: "#D13D3D" },
    { value: 320, label: "Sun", frontColor: "#D13D3D" },
  ];

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex flex-row items-center justify-center py-2 mb-2 px-5">
        <Text className="grow  text-[#D13D3D]">
          <Text className="text-2xl font-bold">CE APPS</Text>
          {"\n"}
          <Text className="truncate text-black font-medium ">Hello, User</Text>
        </Text>

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
          marginBottom: 10,
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
          <View className="bg-[#D13D3D] h-32 rounded-lg flex flex-row p-4 mx-4 mb-2 ">
            <View className="grow text-center items-start justify-center flex flex-col">
              <View className="grow flex flex-row items-center">
                <View className="basis-1/2 text-center items-start">
                  <Text className="font-bold text-xl text-white">
                    Sales Summary
                  </Text>
                  <Text className="font-bold text-2xl text-white mt-5">
                    {Rupiah.format(penjualan)}
                  </Text>
                </View>
                <View className="basis-1/2 items-end">
                  <Ionicons name="logo-usd" size={65} color="white" />
                </View>
              </View>
            </View>
          </View>

          <View className="flex flex-row mb-2 space-x-2 items-center justify-center px-4">
            <View className="bg-[#D13D3D] h-16 rounded-lg flex flex-row space-x-3 basis-full px-4">
              <View className="justify-center">
                <Text className="font-bold text-left text-white">
                  Total Order
                </Text>
                <Text className="font-bold text-left text-white">
                  {Numbering.format(count)}
                </Text>
              </View>
              <View className="grow text-center items-end justify-center">
                <Ionicons name="cart-sharp" size={40} color="white" />
              </View>
            </View>
          </View>

          {/* <View className="mt-2 ml-4 mr-4">
            <BarChart
              showFractionalValue
              showYAxisIndices
              noOfSections={5}
              maxValue={1000}
              data={barData}
              isAnimated
            />
          </View> */}

          {/* Card1 */}
          {/* Card2 */}
          <View className="flex flex-row mb-2 space-x-2 items-center justify-center px-5">
            <View className="bg-[#D13D3D] h-16 rounded-lg flex flex-row space-x-3 basis-1/2 px-4">
              <View className="justify-center">
                <Text className="font-bold text-left text-white">
                  Total Product
                </Text>
                <Text className="font-bold text-left text-white">
                  {total_produk}
                </Text>
              </View>
              <View className="grow text-center items-end justify-center">
                <Ionicons name="cube-sharp" size={40} color="white" />
              </View>
            </View>

            <View className="bg-[#D13D3D] h-16 rounded-lg flex flex-row space-x-3 basis-1/2 px-4">
              <View className="justify-center">
                <Text className="font-bold text-left text-white">
                  Stock Available
                </Text>
                <Text className="font-bold text-left text-white">
                  {Numbering.format(stok_ready)}
                </Text>
              </View>
              <View className="grow text-center items-end justify-center">
                <Ionicons
                  name="checkmark-circle-sharp"
                  size={40}
                  color="white"
                />
              </View>
            </View>
          </View>
          {/* Card2 */}
          {/* Card3 */}
          <View className="flex flex-row mb-2 space-x-2 items-center justify-center px-5">
            <View className="bg-[#D13D3D] h-16 rounded-lg flex flex-row space-x-3 basis-1/2 px-4">
              <View className="justify-center">
                <Text className="font-bold text-left text-white">
                  Stock Requested
                </Text>
                <Text className="font-bold text-left text-white">
                  {Numbering.format(permintaan)}
                </Text>
              </View>
              <View className="grow text-center items-end justify-center">
                <Ionicons name="bar-chart-sharp" size={40} color="white" />
              </View>
            </View>

            <View className="bg-[#D13D3D] h-16 rounded-lg flex flex-row space-x-3 basis-1/2 px-4">
              <View className="justify-center">
                <Text className="font-bold text-left text-white">
                  Stock Unfulfilled
                </Text>
                <Text className="font-bold text-left text-white">
                  {Numbering.format(stok_ready - permintaan)}
                </Text>
              </View>
              <View className="grow text-center items-end justify-center">
                <Ionicons name="contrast-sharp" size={40} color="white" />
              </View>
            </View>
          </View>

          {/* <View className="flex flex-row space-x-2 items-center justify-center px-4">
            <View className=" h-[50px] rounded-t-lg flex flex-row space-x-3 basis-full px-4 border border-gray-200">
              <View className="justify-center ">
                <Text className="font-medium text-xl text-left text-black ">
                  Transaction History
                </Text>
              </View>
              <View className="grow text-center items-end justify-center">
                <Ionicons
                  name="chevron-forward-sharp"
                  size={30}
                  color="black"
                />
              </View>
            </View>
          </View>

          <View className="flex flex-row items-start justify-center rounded-b-lg border border-gray-200 h-[78px] mx-4">
            <View className="basis-1/6 mt-3 mr-1 items-center">
              <Ionicons name="timer-sharp" size={50} color="#D13D3D" />
            </View>
            <View className="basis-2/4 mt-1 items-start">
              <Text className="text-lg">Celana Jogger</Text>
              <Text className="text-xs">OHAYO</Text>
              <Text className="text-xs">10 Pcs</Text>
              <Text className="text-xs">06 Dec 2023, 02:04</Text>
            </View>
            <View className="basis-1/4 mt-8 items-center">
              <Text className="text-xs font-bold text-red-700">
                Rp55.120.500
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-start justify-center rounded-b-lg border border-gray-200 h-[78px] mx-4">
            <View className="basis-1/6 mt-3 mr-1 items-center">
              <Ionicons name="timer-sharp" size={50} color="#D13D3D" />
            </View>
            <View className="basis-2/4 mt-1 items-start">
              <Text className="text-lg">Jacket Winter</Text>
              <Text className="text-xs">OHAYO</Text>
              <Text className="text-xs">21 Pcs</Text>
              <Text className="text-xs">06 Dec 2023, 02:04</Text>
            </View>
            <View className="basis-1/4 mt-8 items-center">
              <Text className="text-xs font-bold text-red-700">
                Rp55.120.500
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-start justify-center rounded-b-lg border border-gray-200 h-[78px] mx-4">
            <View className="basis-1/6 mt-3 mr-1 items-center">
              <Ionicons name="timer-sharp" size={50} color="#D13D3D" />
            </View>
            <View className="basis-2/4 mt-1 items-start">
              <Text className="text-lg">Celana Jogger</Text>
              <Text className="text-xs">OHAYO</Text>
              <Text className="text-xs">10 Pcs</Text>
              <Text className="text-xs">06 Dec 2023, 02:04</Text>
            </View>
            <View className="basis-1/4 mt-8 items-center">
              <Text className="text-xs font-bold text-red-700">
                Rp55.120.500
              </Text>
            </View>
          </View> */}

          {/* Card3 */}
          {/* <Text>{JSON.stringify(data)}</Text> */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
