import React, { useLayoutEffect, useCallback, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/ATComponents/HeaderButton";

import * as loadingClients from "../../store/action/loadingclients";
import DefaultText from "../../components/UI/DefaultText";
import Portfolio from "../../Links/Portfolio";
import Links from "../../Links/Links";
import { Picker } from "@react-native-community/picker";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Layout } from "@ui-kitten/components";
import HeaderNav from "../../components/ATComponents/HeaderNav";

//THESE EXACT SAME STEPS WILL BE FOLLOWED IN PORTFOLIO ALSO

const generateLink = (cCode, bId, cAcnId) => {
  const clientCodeSplitArray = cCode.split("/");

  const accountLink =
    clientCodeSplitArray[0] +
    "%2F" +
    clientCodeSplitArray[1] +
    "%2F" +
    clientCodeSplitArray[2];

  const dateLink = moment(this.date).format("YYYY-MM-DD");

  return (
    Links.mLink +
    Portfolio.clientAccountSumLink +
    "&account=" +
    accountLink +
    "&broker=" +
    bId +
    "&accStmtdate=" +
    dateLink +
    "&clientAnctId=" +
    cAcnId
  );
};

const generateExactValue = (value) => {
  let num = 1;
  const numberSplitArray = value.split("E");

  for (let i = 0; i < numberSplitArray[1]; i++) {
    num = num * 10;
  }

  let exactNum = parseFloat(numberSplitArray[0]);
  const roundUpValue = exactNum * num;

  return roundUpValue.toFixed(2);
};

const AccountSummaryScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [sessionManage, setSessionManage] = useState(true);

  const allClients = useSelector((state) => state.loadingclients.allClients);

  const clientArray = [];

  for (const key in allClients) {
    clientArray.push({
      label:
        allClients[key].clientCode +
        " (" +
        allClients[key].initials +
        allClients[key].lastName +
        ")",
      value: allClients[key].clientCode,
    });
  }
  const dispatch = useDispatch();

  const [cCodeVal, setCCodeVal] = useState("");
  const [totCostPort, setTotCostPort] = useState(0);
  const [totMarketPort, setTotMarketPort] = useState(0);
  const [totGL, setTotGL] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);
  const [buyingPower, setBuyingPower] = useState(0);
  const [pendingBuyOrders, setPendingBuyOrders] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [marginAmountEquity, setMarginAmountEquity] = useState(0);
  const [marginAmountDebt, setMarginAmountDebt] = useState(0);
  const [cashBlock, setCashBlock] = useState(0);
  const [marginBlock, setMarginBlock] = useState(0);

  // textColors for values

  let textColorTotGL = "";
  let textColorCashBalance = "";
  let textColorBuyingPower = "";

  if (totGL > 0) {
    textColorTotGL = "green";
  } else if (totGL < 0) {
    textColorTotGL = "red";
  } else {
    textColorTotGL = "purple";
  }

  if (cashBalance > 0) {
    textColorCashBalance = "green";
  } else if (cashBalance < 0) {
    textColorCashBalance = "red";
  } else {
    textColorCashBalance = "purple";
  }

  if (buyingPower > 0) {
    textColorBuyingPower = "green";
  } else if (buyingPower < 0) {
    textColorBuyingPower = "red";
  } else {
    textColorBuyingPower = "purple";
  }

  const getInformation = async (gotLink) => {
    let totCostPort = "";
    let totMarketValPort = "";
    let totGainLossPort = "";
    let totBuyPowerPort = "";
    let totMarginEquiPort = "";
    let totCashBalancePort = "";

    try {
      const response = await fetch(gotLink);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      totCostPort = generateExactValue(
        object.data.clientSummary.totalPortfolioCost
      );
      setTotCostPort(totCostPort);

      totMarketValPort = generateExactValue(
        object.data.clientSummary.totalPortfolioMarketValue
      );
      setTotMarketPort(totMarketValPort);

      totGainLossPort = generateExactValue(
        object.data.clientSummary.totalGainLoss
      );
      setTotGL(totGainLossPort);

      totCashBalancePort = generateExactValue(
        object.data.clientSummary.cashBalance
      );
      setCashBalance(totCashBalancePort);

      totBuyPowerPort = generateExactValue(
        object.data.clientSummary.buyingPower
      );
      setBuyingPower(totBuyPowerPort);

      setPendingBuyOrders(object.data.clientSummary.totalPendingBuyOrderValue);
      setPercentage(object.data.clientSummary.exposurePercentage);

      totMarginEquiPort = generateExactValue(
        object.data.clientSummary.marginAmount
      );
      setMarginAmountEquity(totMarginEquiPort);

      setMarginAmountDebt(object.data.clientSummary.marginAmountD);
      setCashBlock(object.data.clientSummary.cashBlock);
      setMarginBlock(object.data.clientSummary.marginBlock);
    } catch (error) {
      setSessionManage(false);
    }
  };

  const loadDropDown = useCallback(async () => {
    setIsLoading(true);
    await dispatch(loadingClients.fetchClients());
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
  }, [dispatch]);

  const changeItemHandler = async (itemData) => {
    setCCodeVal(itemData);
    const selectedClient = allClients.find(
      (cli) => cli.clientCode === itemData
    );

    const cCode = selectedClient.clientCode;
    const bId = selectedClient.brokerId;
    const cAcnId = selectedClient.clientacntid;

    const generalLink = generateLink(cCode, bId, cAcnId);
    setLoadingDetails(true);
    await getInformation(generalLink);
    setLoadingDetails(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (clientArray.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Clients. No Information.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Layout style={styles.linearGrad}>
        <HeaderNav
          lIconName={"menu-outline"}
          onSelectLeft={() => props.navigation.toggleDrawer()}
          rIconName={"search-outline"}
          onSelectRight={() => {}}
          headerName={"Account Summary"}
        />
        <View style={styles.dropDownContainer}>
          {clientArray.length !== 0 ? (
            <Picker
              onValueChange={changeItemHandler}
              selectedValue={
                cCodeVal === ""
                  ? changeItemHandler(clientArray[0].value)
                  : cCodeVal
              }
              itemStyle={{ height: 100 }}
            >
              {clientArray.map((itemVal, index) => (
                <Picker.Item
                  label={itemVal.label}
                  value={itemVal.value}
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
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 5 }}>
            <Card style={styles.contentContainer}>
              <DefaultText>Total Cost of the Portfolio</DefaultText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {totCostPort.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <DefaultText>Total Market Value of the Portfolio</DefaultText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {totMarketPort
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <DefaultText>Total Gain/Loss</DefaultText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text style={{ color: textColorTotGL }}>
                  {totGL.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <DefaultText>Cash Balance</DefaultText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text style={{ color: textColorCashBalance }}>
                  {cashBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <DefaultText>Buying Power</DefaultText>

              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text style={{ color: textColorBuyingPower }}>
                  {buyingPower.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <DefaultText>Total Pending Buy Orders Value</DefaultText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {pendingBuyOrders
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <DefaultText>Exposure Precentage</DefaultText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {percentage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <DefaultText>Exposure Margin Amount-Equity</DefaultText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {marginAmountEquity
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <DefaultText>Exposure Margin Amount-Debt</DefaultText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {marginAmountDebt
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <DefaultText>Cash Block Amount</DefaultText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {cashBlock.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
            <Card style={styles.contentContainer}>
              <DefaultText>Margin Block Amount</DefaultText>
              {loadingDetails ? (
                <View>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              ) : (
                <Text>
                  {marginBlock.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
              )}
            </Card>
          </ScrollView>
        </View>
      </Layout>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 75,
    padding: 5,
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});

export default AccountSummaryScreen;
