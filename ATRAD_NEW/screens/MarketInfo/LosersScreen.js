import React, { useCallback, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";

import * as topStocks from "../../store/action/topStocks";
import { useSelector, useDispatch } from "react-redux";
import TitleText from "../../components/UI/TitleText";
import GLTile from "../../components/ATComponents/GLTile";
import Colors from "../../constants/Colors";

const LosersScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const losers = useSelector((state) => state.topStocks.securitiesLoser);

  const dispatch = useDispatch();

  const loadLosers = useCallback(async () => {
    setIsLoading(true);
    await dispatch(topStocks.fetchLosers());
    setIsLoading(false);
  }, [setIsLoading, dispatch]);

  useLayoutEffect(() => {
    loadLosers();
  }, [dispatch, loadLosers]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{ flexDirection: "row", marginVertical: 5, marginHorizontal: 7 }}
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
          onRefresh={loadLosers}
          refreshing={isLoading}
          data={losers}
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
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default LosersScreen;
