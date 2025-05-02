import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import useAppTheme from "@/lib/appTheme";
import { StatusBar } from "react-native";

const TabLayout = () => {
  const { bgColor, textColor, primaryColor } = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: bgColor, borderTopWidth: 0 },
        headerStyle: { backgroundColor: bgColor },
        headerTintColor: textColor,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarLabelStyle: { color: textColor },
          tabBarIcon: () => (
            <FontAwesome5 name="home" size={24} color={textColor} />
          ),
          headerShown: false,
          tabBarAccessibilityLabel: "Dashboard",
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarLabelStyle: { color: textColor },
          tabBarIcon: () => (
            <FontAwesome5 name="history" size={24} color={textColor} />
          ),
          headerShown: false,
          tabBarAccessibilityLabel: "History",
        }}
      />

      <Tabs.Screen
        name="customer-care"
        options={{
          title: "Support",
          tabBarLabelStyle: { color: textColor },
          tabBarIcon: () => (
            <MaterialIcons name="support-agent" size={24} color={textColor} />
          ),
          headerShown: false,
          tabBarAccessibilityLabel: "customer care",
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarLabelStyle: { color: textColor },
          tabBarIcon: () => (
            <MaterialIcons name="settings" size={24} color={textColor} />
          ),
          headerShown: false,
          tabBarAccessibilityLabel: "History",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
