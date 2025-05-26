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
        tabBarStyle: { backgroundColor: primaryColor,  borderTopWidth: 0,  },
        headerTintColor: textColor,
        tabBarLabelStyle:{
          color: 'white'
        },
        tabBarActiveTintColor: primaryColor,
        tabBarActiveBackgroundColor: bgColor
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          
          tabBarIcon: () => (
            <FontAwesome5 name="home" size={24} color='white' />
          ),
          headerShown: false,
          tabBarAccessibilityLabel: "Dashboard",
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          
          headerStyle: {
            backgroundColor: primaryColor
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'white'
          },
          tabBarIcon: () => (
            <FontAwesome5 name="history" size={24} color='white' />
          ),
          tabBarAccessibilityLabel: "History",
        }}
      />

      <Tabs.Screen
        name="customer-care"
        options={{
          title: "Customer Support",
          headerStyle: {
            backgroundColor: primaryColor
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: 'white'
          },
          tabBarIcon: () => (
            <MaterialIcons name="support-agent" size={24} color='white' />
          ),
          
          tabBarAccessibilityLabel: "customer care",
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          title: "Setting",
          tabBarIcon: () => (
            <MaterialIcons name="settings" size={24} color='white' />
          ),
          headerShown: false,
          tabBarAccessibilityLabel: "History",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
