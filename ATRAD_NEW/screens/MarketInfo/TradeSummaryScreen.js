import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
} from "react-native";
import moment from "moment";

import Links from "../../Links/Links";
import Colors from "../../constants/Colors";
import Card from "../../components/UI/Card";
import DefaultText from "../../components/UI/DefaultText";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/action/auth";

const TradeSummary = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tradeSecDetailsArray, setTradeSecDetailsArray] = useState([]);
  const [sessionManage, setSessionManage] = useState(true);
  const dispatch = useDispatch();

  const fetchIndicesSummary = async () => {
    const dateLink = moment(this.date).format("YYYY-MM-DD");

    const usableDate = dateLink.split("-");
    try {
      const response = await fetch(
        Links.mLink +
          "marketdetails?action=getTradeSummary&format=json&tradeDate=" +
          usableDate[1] +
          "%2F" +
          usableDate[2] +
          "%2F" +
          usableDate[0] +
          "&board=ALL"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      setTradeSecDetailsArray(object.data.watch);
    } catch (error) {
      setSessionManage(false);
    }
  };

  const loadTradeData = useCallback(async () => {
    setIsLoading(true);
    await fetchIndicesSummary();
    setIsLoading(false);
  }, [setIsLoading]);

  useLayoutEffect(() => {
    loadTradeData();
  }, [loadTradeData]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderItemHandler = (itemData) => {
    const highVal = itemData.item.highpx;
    const lowVal = itemData.item.lowpx;

    const netChange = itemData.item.netchange;
    const changePercentage = itemData.item.perchange;

    return (
      <Card style={styles.cardContainer}>
        <View style={{ width: "40%" }}>
          <DefaultText>{itemData.item.security}</DefaultText>
          <DefaultText>{itemData.item.companyname}</DefaultText>
        </View>
        <View style={{ width: "15%" }}>
          <DefaultText>{highVal}</DefaultText>
          <DefaultText>{lowVal}</DefaultText>
        </View>
        <View style={{ width: "15%" }}>
          <DefaultText>{netChange}</DefaultText>
          <DefaultText>{changePercentage}%</DefaultText>
        </View>
        <View style={{ width: "30%" }}>
          <DefaultText>{itemData.item.totalvolume}</DefaultText>
          <DefaultText>{itemData.item.totalturnover}</DefaultText>
        </View>
      </Card>
    );
  };

  if (tradeSecDetailsArray) {
    return (
      <View style={styles.centered}>
        <Text>Market Data is not updated for today</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {sessionManage ? (
        <View>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={{ width: "40%" }}>
              <DefaultText>Name</DefaultText>
            </View>
            <View style={{ width: "35%" }}>
              <DefaultText>Volume</DefaultText>
              <DefaultText>TurnOver</DefaultText>
            </View>
            <View style={{ width: "25%", alignItems: "flex-end" }}>
              <DefaultText>Change</DefaultText>
              <DefaultText>Change %</DefaultText>
            </View>
          </View>
          <FlatList
            onRefresh={loadTradeData}
            refreshing={isLoading}
            contentContainerStyle={{ marginHorizontal: 10 }}
            data={tradeSecDetailsArray}
            renderItem={renderItemHandler}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Your session has been timed out</Text>
          <Button
            title="Okay"
            onPress={() => dispatch(authActions.signOut())}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flexDirection: "row",
    width: "100%",
    padding: 5,
  },
  contentContainer: {},
});

export default TradeSummary;
