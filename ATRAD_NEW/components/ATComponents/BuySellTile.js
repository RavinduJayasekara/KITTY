import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const BuySellTile = (props) => {
  return (
    <View>
      <Text>DropDown Company Names</Text>
      <Text>Company Header Name</Text>
      <View style={styles.bidOfferContainer}>
        <View style={styles.textContainer}>
          <Text>Some Amount</Text>
          <Text>Bid: {}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text>Some Amount</Text>
          <Text>Offer: {}</Text>
        </View>
      </View>
      <View style={styles.buySellContainer}>
        <View>
          <Text>DropDown</Text>
          <Text>DropDown Buy Or Sell</Text>
        </View>
        <View style={styles.inputContainer}>
          <View>
            <Text>Price</Text>
            <TextInput />
            <Text></Text>
            <Text></Text>
            <Text>Commision</Text>
            <Text>{}</Text>
          </View>
          <View>
            <Text>Quantity</Text>
            <TextInput />
            <Text>Order Value</Text>
            <Text>{}</Text>
            <Text>Net Value</Text>
            <Text>{}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default BuySellTile;
