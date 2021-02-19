import React, { useCallback, useState, useLayoutEffect } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";

import * as topStocks from "../../store/action/topStocks";
import TurnOverVolumeTile from "../../components/ATComponents/TurnOverVolumeTile";
import TitleText from "../../components/UI/TitleText";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";

const ShareVolumeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const shareVolume = useSelector(
    (state) => state.topStocks.securitiesShareVolume
  );

  const dispatch = useDispatch();

  const loadShareVolume = useCallback(async () => {
    setIsLoading(true);
    await dispatch(topStocks.fetchShareVolume());
    setIsLoading(false);
  }, [setIsLoading, dispatch]);

  useLayoutEffect(() => {
    loadShareVolume();
  }, [dispatch, loadShareVolume]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
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
          onRefresh={loadShareVolume}
          refreshing={isLoading}
          data={shareVolume}
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

export default ShareVolumeScreen;
