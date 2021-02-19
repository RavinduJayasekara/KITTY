import React from "react";
import { View } from "react-native";
import Card from "../UI/Card";
import DefaultText from "../UI/DefaultText";

const TurnOverVolumeTile = (props) => {
  return (
    <Card style={{ flexDirection: "row", padding: 7 }}>
      <View style={{ width: "30%" }}>
        <DefaultText>{props.security}</DefaultText>
        <DefaultText numberOfLines={1}>{props.companyname}</DefaultText>
      </View>
      <View
        style={{
          width: "69%",
          flexDirection: "row",
        }}
      >
        <View style={{ width: "23%" }}>
          <DefaultText>{props.tradeprice}</DefaultText>
        </View>
        <View style={{ width: "36%" }}>
          <DefaultText>{props.totvolume}</DefaultText>
        </View>
        <View style={{ width: "40%" }}>
          <DefaultText>{props.totturnover}</DefaultText>
        </View>
      </View>
    </Card>
  );
};

export default TurnOverVolumeTile;
