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
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";

const width = Dimensions.get("window").width;

export default function BatchScreen({ navigation }) {
  const [isLodaing, setisLodaing] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [DataBatch, setDataBatch] = React.useState([]);
  const [SerachQuery, setSerachQuery] = React.useState("");

  let itemsBatch = DataBatch.filter(
    (item) =>
      item.id_batch.toLowerCase().indexOf(SerachQuery.toLowerCase()) > -1
  );

  async function getDataBatch() {
    try {
      const res = await axios({
        method: "get",
        url: `${process.env.EXPO_PUBLIC_BASE_URL}/purchaseorder/getbatch`,
      });
      setDataBatch(res.data.data);
      setisLodaing(false);
      setRefreshing(false);
    } catch (error) {
      setisLodaing(false);
      setRefreshing(false);
      console.log(error);
    }
  }

  async function deleteBatch(id_batch) {
    try {
      await axios({
        method: "delete",
        url: `${process.env.EXPO_PUBLIC_BASE_URL}/purchaseorder/deletebatch/${id_batch}`,
      });

      getDataBatch();
    } catch (error) {
      console.log(error);
    }
  }

  function onRefreshFunc() {
    getDataBatch();
  }

  React.useEffect(() => {
    setisLodaing(true);
    getDataBatch();
  }, []);

  function itemProduct(item) {
    return (
      <View key={item.id} className="mt-2 px-2" style={{ width: width }}>
        <View className="px-2 bg-white h-auto p-5 flex flex-row items-center rounded-s-2xl  shadow-md">
          <View className="grow space-y-1">
            <Text className="font-bold">{item.id_batch}</Text>
            <Text>Tanggal Keberangkatan : {item.tanggal_batch}</Text>
            <Text>Negara : {item.country}</Text>
            <Text>Kota :{item.city}</Text>
          </View>

          <TouchableOpacity
            className="mr-4"
            onPress={() => {
              Alert.alert(
                `Edit`,
                `Click Edit to Change This Data ${item.id_batch}`,
                [
                  {
                    text: "Cancel",
                  },
                  { text: "Edit", onPress: () => deleteBatch(item.id_batch) },
                ]
              );
            }}
          >
            <Ionicons name="create-outline" size={25} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            className="-mr-2"
            onPress={() => {
              Alert.alert(
                `Delete`,
                `Are You Sure to Delete This Data? ${item.id_batch}`,
                [
                  {
                    text: "Cancel",
                  },
                  { text: "Delete", onPress: () => deleteBatch(item.id_batch) },
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={25} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="mb-0 z-50 flex flex-row items-center p-4">
        <View className="basis-5/6 bg-white">
          <TextInput
            value={SerachQuery}
            placeholder="Search Batch.."
            style={{
              borderWidth: 1,
              padding: 16,
              borderRadius: 8,
              borderColor: "#8EA4BB",
            }}
            onChangeText={(e) => {
              setSerachQuery(e);
            }}
          />
        </View>

        <View className="basis-1/6 flex flex-row justify-end">
          <TouchableOpacity
            onPress={() => navigation.navigate("AddBatch")}
            className="aspect-square w-12 flex flex-row justify-center items-center pl-1 rounded-md bg-[#D13D3D]"
          >
            <Ionicons name={"add"} size={35} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>

      {isLodaing ? (
        <View className="h-full flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : DataBatch.length < 1 ? (
        <View className="grow flex flex-col justify-center items-center">
          <Text>Data Belum Ada, Silahkan Input Data</Text>
          <Button title="Refresh Data" onPress={onRefreshFunc} />
        </View>
      ) : (
        <>
          <FlatList
            className=" bg-gray-50"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshFunc}
                tintColor="red"
              />
            }
            keyExtractor={(item, index) => index.toString()}
            data={itemsBatch}
            renderItem={({ item }) => itemProduct(item)}
          />
        </>
      )}
    </SafeAreaView>
  );
}
