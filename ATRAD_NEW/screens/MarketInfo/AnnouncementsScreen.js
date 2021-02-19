import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  ActivityIndicator,
  FlatList,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";

import AnnouncementTile from "../../components/ATComponents/AnnouncementTile";
import Links from "../../Links/Links";
import Colors from "../../constants/Colors";
import HeaderButton from "../../components/ATComponents/HeaderButton";
import {
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";

const AnnouncementScreen = (props) => {
  const [dOrW, setDOrW] = useState("");
  const [announcementArray, setAnnouncementArray] = useState();
  const announcements = [];
  const [isLoading, setIsLoading] = useState(false);
  const [cSESelected, setCSESelected] = useState(false);
  const [brokerSelected, setBrokerSelected] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isWeekVisible, setIsWeekVisible] = useState(false);

  //UI for the page

  const goBackIcon = () => (
    <Icon name="arrow-back" fill={Colors.white} style={styles.icon} />
  );

  const goBackFunction = () => (
    <TopNavigationAction
      icon={goBackIcon}
      onPress={() => props.navigation.goBack()}
    />
  );

  const getBrokerAnnouncements = async () => {
    try {
      const responseBrokerAnnouncements = await fetch(
        Links.mLink +
          "marketdetails?action=getBrokerAnnouncement&format=json&msgtype=BROKER"
      );

      const resDataBrokerAnnouncements = await responseBrokerAnnouncements.text();

      let replaceStringBrokerAnnouncements = resDataBrokerAnnouncements.replace(
        /'/g,
        '"'
      );
      let objectBrokerAnnouncements = JSON.parse(
        replaceStringBrokerAnnouncements
      );

      return objectBrokerAnnouncements;
    } catch (error) {
      throw error;
    }
  };

  const brokerHandler = () => {
    getBrokerAnnouncements();
    setCSESelected(false);
  };

  const cseHandler = () => {
    setCSESelected(true);
    setBrokerSelected(false);
  };

  const getOneDayAnnouncements = useCallback(async () => {
    try {
      const response = await fetch(
        Links.mLink +
          "marketdetails?action=getCSEAnnouncement&format=json&msgtype=CSE"
      );

      const resData = await response.text();
      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      setAnnouncementArray(object.data.announcement);
    } catch (error) {
      throw error;
    }
  });

  const getWeekAnnouncements = useCallback(async () => {
    const weekAgo = moment().subtract(1, "week").calendar();
    const todayDate = moment(this.date).format("YYYY-MM-DD");

    try {
      const dateSplitArrayToday = todayDate.split("-");
      const dateSplitArrayWeek = weekAgo.split("/");

      const linkToday =
        dateSplitArrayToday[1] +
        "%2F" +
        dateSplitArrayToday[2] +
        "%2F" +
        dateSplitArrayToday[0];

      const linkWeek =
        dateSplitArrayWeek[0] +
        "%2F" +
        dateSplitArrayWeek[1] +
        "%2F" +
        dateSplitArrayWeek[2];

      const response = await fetch(
        Links.mLink +
          "marketdetails?action=getCSEAnnouncementHistory&format=json&msgType=CSE&fromDate=" +
          linkWeek +
          "&toDate=" +
          linkToday +
          "&security=&pageNumber=1"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();
      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      setAnnouncementArray(object.data.announcement);
    } catch (error) {
      throw error;
    }
  });

  const selectedDayHandler = async (itemData) => {
    setDOrW(itemData);
    if (itemData === "1Day") {
      setIsLoading(true);
      await getOneDayAnnouncements();
      setIsLoading(false);
    } else if (itemData === "7Day") {
      setIsLoading(true);
      await getWeekAnnouncements();
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              iconName="ios-search"
              onPress={() => {
                props.navigation.navigate("SearchWindow");
              }}
            />
          </HeaderButtons>
        );
      },
    });
  });

  if (announcementArray) {
    for (const key in announcementArray) {
      announcements.push({
        announcement: announcementArray[key].announcement,
        date: announcementArray[key].date,
        securityId: announcementArray[key].msgSecurityId,
        title: announcementArray[key].subject,
      });
    }
  }

  // console.log(announcements);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Layout level="1" style={styles.header}>
          <TopNavigation
            title={(text) => <Text style={{ fontSize: 20 }}>Market Info</Text>}
            alignment="center"
            accessoryLeft={goBackFunction}
          />
        </Layout>
        <View>
          <Picker
            selectedValue={dOrW === "" ? selectedDayHandler("1Day") : dOrW}
            onValueChange={selectedDayHandler}
          >
            <Picker.Item label={"1 Day"} value={"1Day"} />
            <Picker.Item label={"7 Day"} value={"7Day"} />
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="CSE" onPress={cseHandler} />
          <Button title="Broker" onPress={brokerHandler} />
        </View>
      </View>
      {announcementArray && announcements.length !== 0 && (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={announcements}
          renderItem={(itemData) => (
            <AnnouncementTile
              date={itemData.item.date}
              security={itemData.item.securityId}
              subject={itemData.item.title}
              onPress={() => setIsVisible(true)}
              modal={itemData.item.announcement}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 10,
          }}
        />
      )}
      {/* {!brokerSelected && (
        <View style={styles.centered}>
          <Text>No broker</Text>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  modalS: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 50,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 50,
    paddingVertical: 150,
  },
  container: {
    flex: 1,
  },
  touchable: {
    borderRadius: 50,
    overflow: "hidden",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  icon: { height: 32, width: 32 },
  header: { minHeight: 128, height: "10%", justifyContent: "center" },
});

export default AnnouncementScreen;
