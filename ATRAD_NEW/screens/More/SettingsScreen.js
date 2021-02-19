import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Modal,
  Button,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import * as passwordChangeActions from "../../store/action/passwordChange";
import * as ScreenOrientation from "expo-screen-orientation";

import Colors from "../../constants/Colors";
import Card from "../../components/UI/Card";
import HeaderNav from "../../components/ATComponents/HeaderNav";

const SettingsScreen = (props) => {
  const [visible, setVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const uName = useSelector((state) => state.auth.username);
  const dispatch = useDispatch();

  const changeScreenOrientationToPortrait = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  };

  const oldPasswordHandler = (text) => {
    setOldPassword(text);
  };
  const newPasswordHandler = (text) => {
    setNewPassword(text);
  };
  const confirmPasswordHandler = (text) => {
    setConfirmPassword(text);
  };

  const passwordChangeHandler = (username, oldPw, newPw, confPw) => {
    if (username !== "" && oldPw !== "" && newPw !== "") {
      dispatch(
        passwordChangeActions.passwordChange(username, oldPw, newPw, confPw)
      );
      setVisible(false);
    } else {
      return;
    }
  };

  // useEffect(() => {
  //   const focusSub = props.navigation.addListener(
  //     "focus",
  //     changeScreenOrientationToPortrait
  //   );

  // });

  return (
    <View>
      <HeaderNav
        lIconName={"menu-outline"}
        onSelectLeft={() => props.navigation.toggleDrawer()}
        rIconName={null}
        onSelectRight={() => {}}
        headerName={"Settings"}
      />
      <Card style={styles.passwordHolder}>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <View style={styles.passwordContainer}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={Platform.OS === "android" ? "md-key" : "ios-key"}
                size={25}
                color={Colors.none}
              />
            </View>
            <Text>Change the Password</Text>
          </View>
        </TouchableOpacity>
      </Card>
      <Modal animationType="slide" visible={visible} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 15,
              borderRadius: 15,
              width: "80%",
            }}
          >
            <Text>Current Password:</Text>
            <TextInput
              style={{
                borderBottomColor: Colors.primary,
                borderBottomWidth: 1.5,
                margin: 5,
              }}
              value={oldPassword}
              onChangeText={oldPasswordHandler}
            />
            <Text>New Password:</Text>
            <TextInput
              style={{
                borderBottomColor: Colors.primary,
                borderBottomWidth: 1.5,
                margin: 5,
              }}
              value={newPassword}
              onChangeText={newPasswordHandler}
            />
            <Text>Confirm Password:</Text>
            <TextInput
              style={{
                borderBottomColor: Colors.primary,
                borderBottomWidth: 1.5,
                margin: 5,
              }}
              value={confirmPassword}
              onChangeText={confirmPasswordHandler}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Button title="Cancel" onPress={() => setVisible(false)} />
              <Button
                title="Confirm"
                onPress={passwordChangeHandler.bind(
                  this,
                  uName,
                  oldPassword,
                  newPassword,
                  confirmPassword
                )}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordHolder: {
    margin: 10,
    padding: 5,
  },
  iconContainer: {
    marginHorizontal: 10,
  },
});

export default SettingsScreen;
