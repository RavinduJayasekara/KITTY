import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import moment from "moment";

import Links from "../../Links/Links";
import Colors from "../../constants/Colors";
import Card from "../../components/UI/Card";
import DefaultText from "../../components/UI/DefaultText";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/action/auth";

const IndicesSummary = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [indexSecArray, setIndexSecArray] = useState([]);
  const [sessionManage, setSessionManage] = useState(true);
  const dispatch = useDispatch();
  const fetchIndicesSummary = async () => {
    const dateLink = moment(this.date).format("YYYY-MM-DD");

    const usableDate = dateLink.split("-");

    try {
      const response = await fetch(
        Links.mLink +
          "marketdetails?action=getMarketIndexSummary&format=json&tradeDate=" +
          usableDate[1] +
          "%2F" +
          usableDate[2] +
          "%2F" +
          usableDate[0]
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      console.log(object);
      setIndexSecArray(object.data.index);
    } catch (error) {
      setSessionManage(true);
    }
  };

  const loadIndicesData = useCallback(async () => {
    setIsLoading(true);
    await fetchIndicesSummary();
    setIsLoading(false);
  }, [setIsLoading]);

  useLayoutEffect(() => {
    props.navigation.addListener("focus", loadIndicesData);
  }, [loadIndicesData]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderItemHandler = (itemData) => {
    return (
      <Card style={styles.cardContainer}>
        <View style={{ width: "40%" }}>
          <DefaultText>{itemData.item.sector}</DefaultText>
          <DefaultText>{itemData.item.description}</DefaultText>
        </View>
        <View style={{ width: "35%" }}>
          <DefaultText>{itemData.item.totVolume}</DefaultText>
          <DefaultText>{itemData.item.totTurnOver}</DefaultText>
        </View>
        <View style={{ width: "25%", alignItems: "center" }}>
          <DefaultText>{itemData.item.change}</DefaultText>
          <DefaultText>{itemData.item.perChange}</DefaultText>
        </View>
      </Card>
    );
  };

  if (indexSecArray) {
    return (
      <View style={styles.centered}>
        <Text>Market Data is not updated for today</Text>
      </View>
    );
  }

  if (sessionManage) {
    return (
      <View style={styles.container}>
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
          onRefresh={loadIndicesData}
          refreshing={isLoading}
          contentContainerStyle={{ marginHorizontal: 10 }}
          data={indexSecArray}
          renderItem={renderItemHandler}
          keyExtractor={(item) => item.sector}
        />
      </View>
    );
  } else {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Your session has been timed out</Text>
      <Button title="Okay" onPress={() => dispatch(authActions.signOut())} />
    </View>;
  }
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flexDirection: "row",
    padding: 5,
  },
});

export default IndicesSummary;
