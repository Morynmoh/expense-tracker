import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import CustomTabs from "@/components/CustomTabs";

const _layout = () => {
  return (
    <Tabs tabBar={CustomTabs} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="statistics" options={{ title: "Statistics" }} />
      <Tabs.Screen name="wallet" options={{ title: "Wallet" }} />
      <Tabs.Screen name="graphs" options={{ title: "graphs", href: "/graphs" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
