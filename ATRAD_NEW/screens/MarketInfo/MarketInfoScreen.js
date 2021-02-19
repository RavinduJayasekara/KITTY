import React, { useCallback, useState, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/ATComponents/HeaderButton";
import {
  TopNavigation,
  Layout,
  Icon,
  Text,
  TopNavigationAction,
} from "@ui-kitten/components";
import TitleText from "../../components/UI/TitleText";
import MarketInfo from "../../Links/MarketInfo";
import Links from "../../Links/Links";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import { Picker } from "@react-native-community/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/action/auth";

const generateLinkForSectorData = (secId) => {
  return (
    Links.mLink +
    "sector?action=getSectorData&format=json&exchange=CSE&sectorId=" +
    secId
  );
};

const MarketInfoScreen = (props) => {
  const [marketStatus, setMarketStatus] = useState();
  const [sectorDropDown, setSectorDropDown] = useState([]);
  const [sectorCode, setSectorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMarketInfo, setLoadingMarketInfo] = useState(false);
  const [totVolume, setTotVolume] = useState(0);
  const [totTrades, setTotTrades] = useState(0);
  const [totTurnOver, setTotTurnOver] = useState("");
  const [change, setChange] = useState("");
  const [perChange, setPerChange] = useState("");
  const [previousCloseVal, setPreviousCloseVal] = useState("");
  const [sessionManage, setSessionManage] = useState(true);

  let changeOrPerChangeColor = "";

  const dispatch = useDispatch();

  //UI design for top navigation

  const accessoryLeftIcon = () => (
    <Icon name={"menu-outline"} fill={Colors.white} style={styles.icon} />
  );
  const accessoryRightIcon = () => (
    <Icon name={"search-outline"} fill={Colors.white} style={styles.icon} />
  );

  const accessoryLeftFunction = () => (
    <TopNavigationAction
      icon={accessoryLeftIcon}
      onPress={() => props.navigation.toggleDrawer()}
    />
  );
  const accessoryRightFunction = () => (
    <TopNavigationAction icon={accessoryRightIcon} onPress={() => {}} />
  );

  const getMarketInfo = useCallback(
    async (link) => {
      let totTO = "";
      let totTr = "";
      let totV = "";
      let c = "";
      let pC = "";
      let pCV = "";

      try {
        const response = await fetch(link);

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const resData = await response.text();

        let replaceString = resData.replace(/'/g, '"');
        let object = JSON.parse(replaceString);
        const marketInfoArray = object.data.sector;
        marketInfoArray.map((item) => {
          totTO = item.totTurnOver;
          totV = item.totVolume;
          totTr = item.totTrades;
          c = item.change;
          pC = item.perChange;
          pCV = item.previousCloseVal;
        });

        setTotTurnOver(totTO);
        setTotVolume(parseFloat(totV));
        setTotTrades(parseFloat(totTr));
        setChange(c);
        setPerChange(pC);
        setPreviousCloseVal(pCV);
      } catch (err) {
        setSessionManage(false);
      }
    },
    [
      setTotTrades,
      setTotTurnOver,
      setTotVolume,
      setPerChange,
      setPreviousCloseVal,
      setChange,
    ]
  );

  const getChartInfo = async (sCode) => {
    try {
      const response = await fetch(
        Links.mLink +
          "marketdetails?action=getIntraDayData&format=json&market=CSE&item=" +
          sCode
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
    } catch (err) {
      setSessionManage(false);
    }
  };

  const getMarketStatus = useCallback(async () => {
    try {
      const response = await fetch(Links.mLink + MarketInfo.statusLink);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      setMarketStatus(object.data.status);
    } catch (err) {
      setSessionManage(false);
    }
  }, [setMarketStatus]);

  const getDropDownDetails = useCallback(async () => {
    try {
      const response = await fetch(Links.mLink + MarketInfo.marketDetailsLink);

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      const sectorValues = object.data.indices;
      let arrayList = [];
      for (const key in sectorValues) {
        arrayList.push({
          label: sectorValues[key].sector,
          value: sectorValues[key].sector,
        });
      }
      setSectorDropDown(arrayList);
    } catch (err) {
      setSessionManage(false);
    }
  }, []);

  const loadMarketInfo = useCallback(async () => {
    setIsLoading(true);
    const val = await getMarketStatus();
    await getDropDownDetails();
    setIsLoading(false);
  }, [setIsLoading, getMarketStatus, getDropDownDetails]);

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
    loadMarketInfo();
  }, [loadMarketInfo]);

  const sectorHandling = useCallback(
    async (itemData) => {
      setSectorCode(itemData);
      const linkUrl = generateLinkForSectorData(itemData);
      setLoadingMarketInfo(true);
      const val = await getMarketInfo(linkUrl);
      await getChartInfo(itemData);
      setLoadingMarketInfo(false);
    },
    [setLoadingMarketInfo, getMarketInfo, getChartInfo, setSectorCode]
  );

  if (change < 0 && perChange < 0) {
    changeOrPerChangeColor = Colors.negative;
  } else {
    changeOrPerChangeColor = Colors.positive;
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Layout style={styles.linearGrad}>
        <Layout style={styles.headerStyle} level="1">
          <TopNavigation
            title={(text) => <Text style={{ fontSize: 20 }}>Market Info</Text>}
            alignment="center"
            accessoryLeft={accessoryLeftFunction}
            accessoryRight={accessoryRightFunction}
          />
        </Layout>
        {sessionManage === true ? (
          <ScrollView>
            <View style={styles.headerTitle}>
              <TitleText style={styles.title}>Colombo Stock Exchange</TitleText>
            </View>
            <Layout>
              <Card style={styles.informationContainer}>
                <View style={styles.valueContainer}>
                  <View style={styles.titleContainer}>
                    <TitleText>TurnOver</TitleText>
                    {!loadingMarketInfo ? (
                      <Text style={styles.text}>{totTurnOver}</Text>
                    ) : (
                      <View>
                        <ActivityIndicator
                          size="small"
                          color={Colors.primary}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.titleContainer}>
                    <TitleText>Volume</TitleText>
                    {!loadingMarketInfo ? (
                      <Text style={styles.text}>
                        {totVolume
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Text>
                    ) : (
                      <View>
                        <ActivityIndicator
                          size="small"
                          color={Colors.primary}
                        />
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.valueContainer}>
                  <View style={styles.titleContainer}>
                    <TitleText>Symbol Traded</TitleText>
                    {!loadingMarketInfo ? (
                      <Text style={styles.text}>
                        {totTrades
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Text>
                    ) : (
                      <View>
                        <ActivityIndicator
                          size="small"
                          color={Colors.primary}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.titleContainer}>
                    <TitleText>Market Status</TitleText>
                    <Text
                      style={{
                        color: marketStatus === "Open" ? "green" : "red",
                      }}
                    >
                      {marketStatus}
                    </Text>
                  </View>
                </View>
              </Card>
            </Layout>
            <Card style={styles.midSectionContainer}>
              <View style={styles.midSection}>
                <View style={styles.midContainer}>
                  <Picker
                    onValueChange={sectorHandling}
                    selectedValue={
                      sectorCode === "" ? sectorHandling("ASI") : sectorCode
                    }
                  >
                    {sectorDropDown.map((item, index) => (
                      <Picker.Item
                        label={item.label}
                        value={item.value}
                        key={index}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={styles.midContainer}>
                  {!loadingMarketInfo ? (
                    <Text style={styles.text}>{previousCloseVal}</Text>
                  ) : (
                    <View>
                      <ActivityIndicator size="small" color={Colors.primary} />
                    </View>
                  )}
                  {!loadingMarketInfo ? (
                    <Text style={{ color: changeOrPerChangeColor }}>
                      {change} ({perChange})%
                    </Text>
                  ) : (
                    <View>
                      <ActivityIndicator size="small" color={Colors.primary} />
                    </View>
                  )}
                </View>
              </View>
            </Card>
            <View style={styles.buttonContainer}>
              <Button
                title="Market Summary"
                onPress={() => {
                  props.navigation.navigate("MarketSummaryTabNavigator");
                }}
              />
              <Button
                title="Top Stocks"
                onPress={() => {
                  props.navigation.navigate("TopStocksTabNavigator");
                }}
              />
              <Button
                title="Announcements"
                onPress={() => {
                  props.navigation.navigate("AnnouncementsScreen");
                }}
              />
            </View>
          </ScrollView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Your session has been timed out</Text>
            <Button
              title="Okay"
              onPress={() => dispatch(authActions.signOut())}
            />
          </View>
        )}
      </Layout>
    </View>
  );
};

const styles = StyleSheet.create({
  valueContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  linearGrad: {
    flex: 1,
  },
  icon: { height: 32, width: 32 },
  titleContainer: {
    width: "50%",
  },
  chartContainer: {
    margin: 10,
    borderRadius: 10,
    padding: 6,
  },
  midContainer: {
    width: "50%",
    padding: 5,
  },
  text: { fontSize: 15, color: Colors.none },
  midSectionContainer: {
    padding: 5,
    margin: 10,
    width: "95%",
  },
  midSection: {
    paddingHorizontal: 2,
    flexDirection: "row",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  headerTitle: {
    alignItems: "center",
    marginVertical: 10,
  },
  informationContainer: {
    margin: 10,
    borderRadius: 10,
    padding: 5,
  },
  container: {
    flex: 1,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "white",
  },
  headerStyle: { height: "10%", minHeight: 110, justifyContent: "center" },
});

export default MarketInfoScreen;
