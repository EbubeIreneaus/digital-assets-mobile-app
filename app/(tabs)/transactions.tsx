import LoaderScreen from "@/components/LoaderScreen";
import TransactionItem from "@/components/TransactionItem";
import useAppTheme from "@/lib/appTheme";
import { getToken } from "@/lib/authToken";
import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, View, Text, RefreshControl } from "react-native";
import Toast from 'react-native-simple-toast'

const screenHeight = Dimensions.get("window").height - 100;

const Transactions = () => {
    const { bgColor, textColor, backgroundColor } = useAppTheme();
  const [transactions, setTransactions] = useState([]);
  const [fetching, setFetching] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [query, setQuery] = useState({
    category: "all",
    status: "all",
  });

  const fetchData = async () => {
    try {
      const token = await getToken();
      setFetching(true);
      const q = `category=${query.category}&status=${query.status}`;
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/transaction/all?${q}`,
        {
          headers: {
            Authorization: `Bearer ${token || null}`,
          },
        }
      );

      const res = await req.json();
      if (res.success) {
        setTransactions(res.transactions);
        return true;
      }
      Toast.show("unknown server error", Toast.LONG);
    } catch (error: any) {
      Toast.show("unknown server error", Toast.LONG);
      console.log(error.message);
    }finally{
      setFetching(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  const onRefresh = useCallback(async() => {
    await fetchData()
    setRefreshing(false)
  }, [])

  return (
    <View className="dark:bg-bgDark bg-bgLight flex-1 justify-center">
      {fetching && <LoaderScreen />}
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} key={item.id} />}
        keyExtractor={(item: any) => item.id}
        style={{ minHeight: screenHeight }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressBackgroundColor={bgColor} colors={[textColor]} tintColor={textColor} />}
        className="dark:bg-dark bg-light mx-3 rounded-xl py-10"
        ListHeaderComponent={
          <View className="p-3 mb-5">
            <View className="flex-row gap-x-5">
              <View className="dark:bg-bgDark bg-bgLight rounded-md flex-1">
                <Picker
                  style={{ color: textColor, height: 50 }}
                  dropdownIconColor={textColor}
                  selectedValue={query.status}
                  onValueChange={(val) => setQuery({ ...query, status: val })}
                  className="f"
                >
                  {Status.map((status: any) => (
                    <Picker.Item
                      style={{ height: 50 }}
                      value={status.name}
                      label={status.label}
                      key={status.name}
                    />
                  ))}
                </Picker>
              </View>

              <View className="dark:bg-bgDark bg-bgLight rounded-xl flex-1">
                <Picker
                  style={{ color: textColor }}
                  onValueChange={(val) => setQuery({ ...query, category: val })}
                  dropdownIconColor={textColor}
                  selectedValue={query.category}
                  className="f"
                >
                  {Categories.map((cat: any) => (
                    <Picker.Item
                      value={cat.name}
                      label={cat.label}
                      key={cat.name}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="min-h-[300px] justify-center items-center">
                          <Text className="text-primary text-lg font-semibold">
                            No Recent transaction
                          </Text>
                        </View>
        }
      />
    </View>
  );
};

export default Transactions;

const Categories = [
  { name: "all", label: "All Categories" },
  { name: "deposit", label: "Deposit" },
  { name: "withdrawal", label: "Withdrawl" },
  { name: "realestate", label: "Real Estate" },
  { name: "crypto", label: "Crypto Currency" },
  { name: "stock", label: "Stock" },
  { name: "retirement", label: "Retirement" },
];

const Status = [
  { name: "all", label: "All Status" },
  { name: "success", label: "successfull" },
  { name: "pending", label: "Pending" },
  { name: "failed", label: "Failed" },
];
