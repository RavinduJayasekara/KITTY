import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TouchableNativeFeedback,
} from "react-native";
import DefaultText from "../UI/DefaultText";
import Card from "../UI/Card";
import Links from "../../Links/Links";

const AllSecurityTile = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android") {
    TouchableCmp = TouchableNativeFeedback;
  }

  const addSecuritiesToList = async (secCode, userWatchId) => {
    const linkUrl =
      Links.mLink +
      "watch?action=addUserSecurity&format=json&exchange=CSE&bookDefId=1&securityid=" +
      secCode +
      "&watchId=" +
      userWatchId +
      "&isquickwatchsecurity=false";

    const response = await fetch(linkUrl);

    const resData = await response.text();

    let replaceString = resData.replace(/'/g, '"');
    let object = JSON.parse(replaceString);

    if (object.errorData === "") {
      Alert.alert(
        "Successfully Added",
        "Successfully Added Security " + secCode
      );
    } else {
      Alert.alert("Already Added", "Securities already exsists" + secCode);
    }
  };

  return (
    <Card style={styles.container}>
      <TouchableCmp
        onPress={() => addSecuritiesToList(props.cSecurity, props.watchID)}
      >
        <View style={styles.titleContainer}>
          <DefaultText style={styles.secTitle} numberOfLines={1}>
            {props.cSecurity}
          </DefaultText>
          <DefaultText numberOfLines={1}>{props.cName}</DefaultText>
        </View>
      </TouchableCmp>
    </Card>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    height: 70,
    padding: 5,
  },
  secTitle: {
    fontSize: 20,
  },
  container: {
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
});

export default AllSecurityTile;
