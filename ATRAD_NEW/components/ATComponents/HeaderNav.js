import React from "react";
import {
  Icon,
  TopNavigationAction,
  Layout,
  TopNavigation,
  Text,
} from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const HeaderNav = (props) => {
  const accessoryLeftIcon = () => (
    <Icon name={props.lIconName} style={styles.icon} fill={Colors.white} />
  );
  const accessoryLeftFunction = () => (
    <TopNavigationAction
      icon={accessoryLeftIcon}
      onPress={props.onSelectLeft}
    />
  );

  const accessoryRightIcon = () => (
    <Icon name={props.rIconName} style={styles.icon} fill={Colors.white} />
  );

  const accessoryRightFunction = () => (
    <TopNavigationAction
      icon={props.rIconName ? accessoryRightIcon : null}
      onPress={props.rIconName ? props.onSelectRight : () => {}}
    />
  );
  return (
    <Layout style={styles.headerStyle} level="1">
      <TopNavigation
        title={(text) => (
          <Text style={{ fontSize: 20 }}>{props.headerName}</Text>
        )}
        alignment="center"
        accessoryLeft={accessoryLeftFunction}
        accessoryRight={accessoryRightFunction}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  icon: { height: 32, width: 32 },
  headerStyle: { minHeight: 128, height: "10%", justifyContent: "center" },
});

export default HeaderNav;
