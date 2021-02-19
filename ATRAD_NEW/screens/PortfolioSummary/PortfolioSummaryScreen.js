import React, { useState, useLayoutEffect, useCallback } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import Links from "../../Links/Links";
import Portfolio from "../../Links/Portfolio";
import TitleText from "../../components/UI/TitleText";
import DefaultText from "../../components/UI/DefaultText";
import { Picker } from "@react-native-community/picker";
import Card from "../../components/UI/Card";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import HeaderButton from "../../components/ATComponents/HeaderButton";
import {
  Icon,
  TopNavigationAction,
  TopNavigation,
  Layout,
  Text,
} from "@ui-kitten/components";

const generateLink = (cCode, bId, cLastName, cInitials) => {
  const clientCodeSplitArray = cCode.split("/");

  const accountLink =
    clientCodeSplitArray[0] +
    "%2F" +
    clientCodeSplitArray[1] +
    "%2F" +
    clientCodeSplitArray[2];

  return (
    Links.mLink +
    Portfolio.clientPortfolioLink +
    "&account=" +
    accountLink +
    "&broker=" +
    bId +
    "&portfolioClientAccount=" +
    accountLink +
    "+(" +
    cInitials +
    "+" +
    cLastName +
    ")&portfolioAsset=EQUITY"
  );
};

const PortfolioSummaryScreen = (props) => {
  const dispatch = useDispatch();
  const [dropDownElements, setDropDownElements] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [commission, setCommision] = useState(0);
  const [salesProceeds, setSalesProceeds] = useState(0);
  const [netGain, setNetGain] = useState(0);
  const [totCost, setTotCost] = useState(0);
  const [marketValue, setMarketValue] = useState(0);
  const [unrTotal, setUnrTotal] = useState(0);
  const [cCodeVal, setCCodeVal] = useState("");
  const [sessionManage, setSessionManage] = useState(true);
  let textColorGain = "";
  let textColorUnr = "";

  const dropDownArray = [];

  //UI design of the header

  const accessoryLeftIcon = () => (
    <Icon name={"menu-outline"} style={styles.icon} fill={Colors.white} />
  );
  const accessoryLeftFunction = () => (
    <TopNavigationAction
      icon={accessoryLeftIcon}
      onPress={() => props.navigation.toggleDrawer()}
    />
  );
  const accessoryRightIcon = () => (
    <Icon name={"search-outline"} style={styles.icon} fill={Colors.white} />
  );
  const accessoryRightFunction = () => (
    <TopNavigationAction
      icon={accessoryRightIcon}
      onPress={() => props.navigation.goBack()}
    />
  );

  for (const key in dropDownElements) {
    dropDownArray.push({
      label:
        dropDownElements[key].clientCode +
        " (" +
        dropDownElements[key].initials +
        dropDownElements[key].lastName +
        ")",
      value: dropDownElements[key].clientCode,
    });
  }

  //check if a drop down value is selected

  const fetchPortfolioDetails = useCallback(async (link) => {
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      const portfolioDetails = object.data.portfolios;
      let allCommisions = 0;
      let allSalesProceeds = 0;
      let allNetGain = 0;
      let allTotCost = 0;
      let allUnrGainOrLoss = 0;
      for (const key in portfolioDetails) {
        allCommisions =
          allCommisions + parseFloat(portfolioDetails[key].commission);
        allSalesProceeds =
          allSalesProceeds + parseFloat(portfolioDetails[key].salesproceeds);
        allNetGain = allNetGain + parseFloat(portfolioDetails[key].netGain);
        allTotCost = allTotCost + parseFloat(portfolioDetails[key].totCost);
        allUnrGainOrLoss =
          allUnrGainOrLoss +
          parseFloat(
            portfolioDetails[key].netchange * portfolioDetails[key].quantity
          );
      }
      setCommision(allCommisions.toFixed(2));
      // commisions = allCommisions.toFixed(2);
      setSalesProceeds(allSalesProceeds.toFixed(2));
      // salesProceeds = allSalesProceeds.toFixed(2);
      setNetGain(allNetGain.toFixed(2));
      // netGain = allNetGain.toFixed(2);
      setTotCost(allTotCost.toFixed(2));
      // totCost = allTotCost.toFixed(2);
      setMarketValue(parseFloat(object.data.markerValTot).toFixed(2));
      // marketValue = parseFloat(object.data.markerValTot).toFixed(2);
      setUnrTotal(allUnrGainOrLoss.toFixed(2));
      // unrTotal = allUnrGainOrLoss.toFixed(2);
    } catch (err) {
      setSessionManage(false);
    }
  }, []);

  //check if netGain and unrTotal are positive negative or zero

  if (netGain > 0) {
    textColorGain = "green";
  } else if (netGain < 0) {
    textColorGain = "red";
  } else {
    textColorGain = "purple";
  }

  if (unrTotal > 0) {
    textColorUnr = "green";
  } else if (unrTotal < 0) {
    textColorUnr = "red";
  } else {
    textColorUnr = "purple";
  }

  const setClients = useCallback(async () => {
    try {
      const response = await fetch(Links.mLink + Portfolio.getUserDetailsLink);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      setDropDownElements(object.data.userids);
    } catch (err) {
      setSessionManage(false);
    }
  }, [setDropDownElements]);

  const loadDropDown = useCallback(async () => {
    setIsLoading(true);
    await setClients();
    setIsLoading(false);
  }, [setIsLoading, dispatch]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              iconName="ios-search"
              onPress={() => {
                props.navigation.navigate("SearchWindowScreen");
              }}
            />
          </HeaderButtons>
        );
      },
    });
    loadDropDown();
  }, [loadDropDown]);

  const changeItemHandler = async (itemData) => {
    setCCodeVal(itemData);
    const selectedClient = dropDownElements.find(
      (cli) => cli.clientCode === itemData
    );
    const bId = selectedClient.brokerId;
    const cCode = selectedClient.clientCode;
    const cLastName = selectedClient.lastName;
    const cInitials = selectedClient.initials;

    const linkUrl = generateLink(cCode, bId, cLastName, cInitials);
    setLoadingDetails(true);
    await fetchPortfolioDetails(linkUrl);
    setLoadingDetails(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (dropDownArray.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Clients. No Information.</Text>
      </View>
    );
  }

  if (sessionManage) {
    return (
      <View style={styles.container}>
        <Layout style={styles.headerStyle} level="1">
          <TopNavigation
            title={() => (
              <Text style={{ fontSize: 20 }}>Portfolio Summary</Text>
            )}
            alignment="center"
            accessoryLeft={accessoryLeftFunction}
            accessoryRight={accessoryRightFunction}
          />
        </Layout>
        <View style={styles.dropDownContainer}>
          {dropDownArray.length !== 0 ? (
            <Picker
              style={{ width: "100%" }}
              onValueChange={changeItemHandler}
              selectedValue={
                cCodeVal === ""
                  ? changeItemHandler(dropDownArray[0].value)
                  : cCodeVal
              }
            >
              {dropDownArray.map((item, index) => (
                <Picker.Item
                  label={item.label}
                  value={item.value}
                  key={index}
                />
              ))}
            </Picker>
          ) : (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
        </View>
        <View style={styles.detailContainer}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 5 }}>
            <Card style={styles.contentContainer}>
              <TitleText>Total Cost</TitleText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <DefaultText>{totCost}</DefaultText>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <TitleText>Market Value</TitleText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <DefaultText>{marketValue}</DefaultText>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <TitleText>Sales Commision</TitleText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <DefaultText>{commission}</DefaultText>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <TitleText>Sales Proceeds</TitleText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <DefaultText>{salesProceeds}</DefaultText>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <TitleText>Unrealized Gain/(Loss)</TitleText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <DefaultText style={{ color: textColorGain }}>
                  {netGain}
                </DefaultText>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <TitleText>Unr Today Gain/(Loss)</TitleText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <DefaultText style={{ color: textColorUnr }}>
                  {unrTotal}
                </DefaultText>
              )}
            </Card>
          </ScrollView>
        </View>
      </View>
    );
  } else {
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Your session has been timed out</Text>
        <Button title="Okay" onPress={() => dispatch(authActions.signOut())} />
      </View>
    </View>;
  }
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    padding: 5,
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  dropDownContainer: {
    width: "97%",
    backgroundColor: "white",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: "1.5%",
    shadowColor: Colors.none,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    elevation: 10,
  },
  linearGrad: {
    flex: 1,
  },
  detailContainer: {
    flex: 1,
    position: "relative",
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerStyle: { minHeight: 128, height: "10%", justifyContent: "center" },
  icon: { height: 32, width: 32 },
});

export default PortfolioSummaryScreen;
