import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
} from "react-native";
import { DrawerItem } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import Card from "../UI/Card";
import DefaultText from "../UI/DefaultText";

const WatchTile = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android") {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.container}>
      <View>
        <View
          style={{
            width: "100%",
            justifyContent: "flex-end",
            flexDirection: "row",
            paddingHorizontal: 10,
            backgroundColor: "white",
            borderColor: Colors.none,
            borderWidth: 1.5,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingVertical: 2,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#ccc",
              width: 25,
              height: 25,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100,
            }}
            onPress={props.removeHandler}
          >
            <Ionicons
              name={Platform.OS === "android" ? "md-close" : "ios-close"}
              size={23}
              color={Colors.none}
            />
          </TouchableOpacity>
        </View>
        <TouchableCmp onPress={props.onPress}>
          <View style={styles.detailContainer}>
            <View style={{ width: "44%" }}>
              <Text style={{ ...styles.titleText, ...{ fontSize: 20 } }}>
                {props.cSecurity}
              </Text>
              <DefaultText style={styles.titleText} numberOfLines={1}>
                {props.cName}
              </DefaultText>
            </View>
            <View style={{ width: "22%" }}>
              <Text style={styles.titleText}>{props.cTradePrice}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color:
                    parseFloat(props.cNetChange).toFixed(2) < 0
                      ? Colors.negative
                      : Colors.positive,
                }}
              >
                {props.cNetChange}
              </Text>
              <Text
                style={{
                  color:
                    parseFloat(props.cPerChange).toFixed(2) < 0
                      ? Colors.negative
                      : Colors.positive,
                }}
              >
                {props.cPerChange}
              </Text>
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
    // <DrawerItem onPress={props.onPress}>
    //   <View style={styles.detailContainer}>
    //     <View style={{ width: "44%" }}>
    //       <Text style={{ ...styles.titleText, ...{ fontSize: 20 } }}>
    //         {props.cSecurity}
    //       </Text>
    //       <DefaultText style={styles.titleText} numberOfLines={1}>
    //         {props.cName}
    //       </DefaultText>
    //     </View>
    //     <View style={{ width: "22%" }}>
    //       <Text style={styles.titleText}>{props.cTradePrice}</Text>
    //     </View>
    //     <View style={{ alignItems: "flex-end" }}>
    //       <Text
    //         style={{
    //           color:
    //             parseFloat(props.cNetChange).toFixed(2) < 0
    //               ? Colors.negative
    //               : Colors.positive,
    //         }}
    //       >
    //         {props.cNetChange}
    //       </Text>
    //       <Text
    //         style={{
    //           color:
    //             parseFloat(props.cPerChange).toFixed(2) < 0
    //               ? Colors.negative
    //               : Colors.positive,
    //         }}
    //       >
    //         {props.cPerChange}
    //       </Text>
    //     </View>
    //   </View>
    // </DrawerItem>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  container: {
    overflow: Platform.OS === "android" ? "hidden" : "visible",
    backgroundColor: Colors.none,
  },
  titleText: {
    color: Colors.white,
  },
});

export default WatchTile;
