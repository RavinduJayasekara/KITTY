import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  Modal,
} from "react-native";
import Card from "../UI/Card";

const AnnouncementTile = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === "android") {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <View>
      <Card style={styles.announcementTileStyle}>
        <TouchableCmp onPress={() => setIsVisible(true)}>
          <View style={styles.touchable}>
            <View style={styles.dateSecContainer}>
              <View style={styles.dScontainer}>
                <Text>{props.date}</Text>
              </View>
              <View style={styles.dScontainer}>
                <Text>{props.security}</Text>
              </View>
            </View>
            <View style={styles.container}>
              <Text style={styles.title}>{props.subject}</Text>
            </View>
          </View>
        </TouchableCmp>
      </Card>
      <Modal visible={isVisible} transparent={true}>
        <View style={styles.modalS}>
          <View style={styles.modalTouchable}>
            <TouchableCmp onPress={() => setIsVisible(false)}>
              <Card style={styles.modalContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{props.subject}</Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.details}>{props.security}</Text>
                </View>
                <View style={styles.announcementSet}>
                  <Text style={styles.details}>{props.modal}</Text>
                </View>
              </Card>
            </TouchableCmp>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  announcementTileStyle: {
    width: "100%",
    overflow: "hidden",
  },
  modalTouchable: {
    padding: 30,
  },
  touchable: {
    padding: 20,
  },
  titleContainer: {
    paddingBottom: 20,
  },
  dateSecContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  modalS: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    padding: 50,
    // paddingVertical: 150,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
  },
  details: { textAlign: "center" },
  announcementSet: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
});

export default AnnouncementTile;
