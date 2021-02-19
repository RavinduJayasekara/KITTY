import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/ATComponents/HeaderButton";

import * as topStocks from "../../store/action/topStocks";
import TitleText from "../../components/UI/TitleText";
import GLTile from "../../components/ATComponents/GLTile";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/action/auth";

const GainersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const gainers = useSelector((state) => state.topStocks.securitiesGainer);

  // console.log(gainers);

  const dispatch = useDispatch();

  const loadGainers = useCallback(async () => {
    setIsLoading(true);
    await dispatch(topStocks.fetchGainers());
    setIsLoading(false);
  }, [dispatch, setIsLoading]);

  useLayoutEffect(() => {
    loadGainers();
  }, [dispatch, loadGainers]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 5,
          marginHorizontal: 7,
        }}
      >
        <View style={{ width: "50%" }}>
          <TitleText>Symbol</TitleText>
        </View>
        <View
          style={{
            width: "50%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TitleText>Last</TitleText>
          <TitleText>Change</TitleText>
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          onRefresh={loadGainers}
          refreshing={isLoading}
          data={gainers}
          contentContainerStyle={styles.list}
          renderItem={(itemData) => {
            return (
              <GLTile
                security={itemData.item.security}
                companyname={itemData.item.companyname}
                tradeprice={itemData.item.tradeprice}
                perchange={itemData.item.perchange}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    width: "100%",
  },
  list: {},
  container: {
    flex: 1,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default GainersScreen;
