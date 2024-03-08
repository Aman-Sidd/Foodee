import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { reloadAsync } from "expo-updates";

const checkNetworkConnectivity = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

const NetworkErrorScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorMessage}>
        Oops! Please check your network connection and try again.
      </Text>
      <TouchableOpacity
        onPress={async () => {
          const isConnected = await checkNetworkConnectivity();
          console.log("isConnected: ", isConnected);
          if (isConnected) {
            await reloadAsync();
          } else
            Alert.alert(
              "Network Error!",
              "Please check your network connection and try again!"
            );
        }}
        style={styles.retryButton}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Customize background color
  },
  errorMessage: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    color: "#333333", // Customize text color
  },
  retryButton: {
    backgroundColor: "#007bff", // Customize button background color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  retryButtonText: {
    fontSize: 18,
    color: "#ffffff", // Customize button text color
  },
});

export default NetworkErrorScreen;
