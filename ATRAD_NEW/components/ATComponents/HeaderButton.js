import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const CustomHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      iconSize={25}
      color={Colors.white}
      IconComponent={Ionicons}
    />
  );
};

export default CustomHeaderButton;
