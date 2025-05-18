import TransactionItem from "@/components/TransactionItem";
import { getToken } from "@/lib/authToken";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, ToastAndroid, View } from "react-native";

const screenHeight = Dimensions.get("window").height - 100;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState({
    category: "all",
    status: "all",
  });

  const fetchData = async () => {
    try {
      const token = await getToken();
      const q = `category=${query.category}&status=${query.status}`
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
      ToastAndroid.show("unknown server error", ToastAndroid.LONG);
    } catch (error: any) {
      ToastAndroid.show("unknown server error", ToastAndroid.LONG);
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  return (
    <View className="dark:bg-bgDark bg-bgLight flex-1 justify-center">
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} key={item.id} />}
        keyExtractor={(item: any) => item.id}
        style={{ minHeight: screenHeight }}
        className="dark:bg-dark bg-light mx-3 rounded-xl py-10"
        ListHeaderComponent={
          <View className="p-3 mb-5">
            <View className="flex-row gap-x-5">
              <View className="dark:bg-slate-950 bg-slate-200 rounded-md flex-1">
                <Picker
                  style={{ color: "white", height: 50 }}
                  dropdownIconColor="white"
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

              <View className='dark:bg-slate-950 bg-slate-200 rounded-xl flex-1'>
                <Picker style={{ color: 'white' }} onValueChange={(val) => setQuery({...query, category: val})} dropdownIconColor='white' selectedValue={query.category} className='f'>
                  {
                    Categories.map((cat: any) => <Picker.Item value={cat.name} label={cat.label} key={cat.name} />)
                  }
                </Picker>
              </View>
            </View>
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
