import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

const MarketScreen = (props) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.linearGrad}
        colors={["#000000", "#696c69", "#b0bab1"]}
      >
        <Text>MarketScreen</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  linearGrad: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default MarketScreen;
