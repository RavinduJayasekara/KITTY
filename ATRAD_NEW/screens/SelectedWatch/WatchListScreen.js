import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "react-native-elements";
import { List, ListItem, Icon, Button } from "@ui-kitten/components";
import HeaderNav from "../../components/ATComponents/HeaderNav";

import AllSecurityTile from "../../components/ATComponents/AllSecurityTile";
import Colors from "../../constants/Colors";
import * as dropdownAllSecurities from "../../store/action/dropdownsecurities";

const WatchListScreen = (props) => {
  const watchId = useSelector((state) => state.auth.watchId);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const allSecurities = useSelector(
    (state) => state.dropdownsecurities.securityDetails
  );

  const securityDetails = useSelector(
    (state) => state.dropdownsecurities.securityDetails
  );
  const [searchedSecurities, setSearchedSecurities] = useState([]);

  const searchHandler = (text) => {
    setSearchWord(text);
    let securityToUpperCase = text.toUpperCase();

    const filteredSecuritities = allSecurities.filter((sec) =>
      sec.security.match(securityToUpperCase, "g")
    );

    setSearchedSecurities(filteredSecuritities);
  };

  const loadAllSecurities = useCallback(async () => {
    setIsLoading(true);
    await dispatch(dropdownAllSecurities.fetchDropDownAllSecurities());
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    loadAllSecurities();
  }, [loadAllSecurities]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderItemAccessory = (props) => <Button size="tiny">FOLLOW</Button>;

  const renderItemIcon = (props) => <Icon {...props} name="person" />;

  return (
    <View style={styles.container}>
      <HeaderNav
        lIconName={"arrow-back"}
        onSelectLeft={() => props.navigation.goBack()}
        rIconName={null}
        onSelectRight={null}
        headerName={"Select Symbol/Company"}
      />
      <SearchBar
        platform={Platform.OS === "android" ? "android" : "ios"}
        placeholder={"Type Here..."}
        onChangeText={searchHandler}
        value={searchWord}
      />
      <List
        contentContainerStyle={{ marginHorizontal: 5, paddingHorizontal: 5 }}
        data={searchWord === "" ? allSecurities : searchedSecurities}
        renderItem={(itemData) => (
          <AllSecurityTile
            cSecurity={itemData.item.security}
            cName={itemData.item.securityDes}
            watchID={watchId}
          />
        )}
        // renderItem={(itemData) => (
        //   <ListItem
        //     title={itemData.item.security}
        //     description={() => (
        //       <AllSecurityTile
        //         cSecurity={itemData.item.security}
        //         cName={itemData.item.securityDes}
        //         watchID={watchId}
        //       />
        //     )}
        //     style={{ borderBottomColor: Colors.primary, borderBottomWidth: 1 }}
        //     accessoryLeft={renderItemIcon}
        //     accessoryRight={renderItemAccessory}
        //   />
        // )}
        keyExtractor={(item) => item.security}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
});

export default WatchListScreen;
