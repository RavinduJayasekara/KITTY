import React, { useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import { useSelector } from "react-redux";
import Links from "../../Links/Links";

const ChartScreen = (props) => {
  const username = useSelector((state) => state.auth.username);

  const changeScreenOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  };

  const changeScreenOrientationToPortrait = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  };

  useEffect(() => {
    const focusSub = props.navigation.addListener(
      "focus",
      changeScreenOrientation
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{
          uri:
            Links.mLink +
            `view/html/chart/tv_charts.jsp?symbol=&userid=${username}`,
        }}
        style={{ flex: 1 }}
        keyboardDisplayRequiresUserAction={false}
        useWebKit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropDownContainer: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
  },
});

export default ChartScreen;
