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
import { BASE_URL } from "@env";

let Rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

let Numbering = new Intl.NumberFormat("id-ID");

const width = Dimensions.get("window").width;

export default function PrapoScreen({ navigation }) {
  const [isLodaing, setisLodaing] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [DataPo, setDataPo] = React.useState([]);
  const [SerachQuery, setSerachQuery] = React.useState("");

  const [open, setOpen] = React.useState(false);
  let dataItems_ = [];
  const [items, setItems] = React.useState(dataItems_);
  const [value, setValue] = React.useState("");
  const [id_batch, setid_batch] = React.useState("");

  var itemsBatch = DataPo.filter(function (DataPo) {
    if (SerachQuery === "") {
      return DataPo.id_batch.toLowerCase();
    } else {
      return DataPo.id_batch.toLowerCase() === SerachQuery.toLowerCase();
    }
  });

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
        getDataPo(res.data.data[0].id_batch);
        setValue(res.data.data[0].id_batch);
      } else {
        if (!dataItems_.find((o) => o.value === value)) {
          getDataPo(res.data.data[0].id_batch);
          setValue(res.data.data[0].id_batch);
        }

        getDataPo(value);
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

  async function getDataPo(id_batch) {
    try {
      const res = await axios({
        method: "get",
        url: `http://139.180.130.182:4000/purchaseorder/getpobybatch/${id_batch}`,
      }).catch(function (error) {
        // handle error
        console.log(error);
      });

      setDataPo(res.data.data);
      setisLodaing(false);
      setRefreshing(false);
    } catch (error) {
      setisLodaing(false);
      setRefreshing(false);
      console.log(error);
    }
  }

  async function deleteBatch(id_batch, id_po) {
    try {
      await axios({
        method: "delete",
        url: `http://139.180.130.182:4000/purchaseorder/deletepo/${id_batch}/${id_po}`,
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
        <View className="px-2 bg-white border border-gray-100 h-auto p-5 rounded-2xl  shadow-md flex flex-row items-center">
          <View className="grow space-y-1">
            <Text className="font-bold">{item.id_po}</Text>
            <Text>KURS : {Rupiah.format(item.kurs)}</Text>
            <Text>OVERHEAD : {Rupiah.format(item.overhead_gr)}</Text>
            <Text>MARGIN : {item.margin}%</Text>
          </View>

          <TouchableOpacity
            className="mr-4"
            onPress={() => {
              Alert.alert(
                `Edit`,
                `Click Edit to Change This Data ${item.id_po}`,
                [
                  {
                    text: "Cancel",
                  },
                  {
                    text: "Edit",
                    onPress: () => deleteBatch(item.id_batch, item.id_po),
                  },
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
                `Are You Sure to Delete This Data? ${item.id_po}`,
                [
                  {
                    text: "Cancel",
                  },
                  {
                    text: "Delete",
                    onPress: () => deleteBatch(item.id_batch, item.id_po),
                  },
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
                getDataPo(item.value);
              }
            }}
          />
        </View>

        <View className="basis-1/6 flex flex-row justify-end">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddPo", {
                id_batch: value,
              })
            }
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
      ) : DataPo.length < 1 ? (
        <View className="grow flex flex-col justify-center items-center">
          <Text>Data Belum Ada, Silahkan Input PO</Text>
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
