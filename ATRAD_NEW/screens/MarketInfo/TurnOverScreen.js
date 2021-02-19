import React, { useCallback, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as topStocks from "../../store/action/topStocks";
import TitleText from "../../components/UI/TitleText";
import TurnOverVolumeTile from "../../components/ATComponents/TurnOverVolumeTile";
import Colors from "../../constants/Colors";

const TurnOverScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const turnOver = useSelector((state) => state.topStocks.securitiesTurnOver);

  const dispatch = useDispatch();

  const loadTurnOver = useCallback(async () => {
    setIsLoading(true);
    await dispatch(topStocks.fetchTurnOver());
    setIsLoading(false);
  }, [dispatch, setIsLoading]);

  useLayoutEffect(() => {
    loadTurnOver();
  }, [dispatch, loadTurnOver]);

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
        style={{ flexDirection: "row", marginVertical: 5, marginHorizontal: 5 }}
      >
        <View style={{ width: "30%" }}>
          <TitleText>Symbol</TitleText>
        </View>
        <View
          style={{
            width: "70%",
            flexDirection: "row",
          }}
        >
          <View style={{ width: "23%" }}>
            <TitleText>Last</TitleText>
          </View>
          <View style={{ width: "40%" }}>
            <TitleText>Volume</TitleText>
          </View>
          <View style={{ width: "36%" }}>
            <TitleText>Turnover</TitleText>
          </View>
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          onRefresh={loadTurnOver}
          refreshing={isLoading}
          data={turnOver}
          renderItem={(itemData) => {
            return (
              <TurnOverVolumeTile
                security={itemData.item.security}
                companyname={itemData.item.companyname}
                tradeprice={itemData.item.tradeprice}
                totvolume={itemData.item.totvolume}
                totturnover={itemData.item.totturnover}
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

export default TurnOverScreen;
