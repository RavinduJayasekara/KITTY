import React, { useState, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Modal,
  Button,
  TouchableOpacity,
  FlatList,
  TouchableNativeFeedback,
} from "react-native";
import { SearchBar } from "react-native-elements";

import Colors from "../../constants/Colors";
import { Picker } from "@react-native-community/picker";
import Watch from "../../Links/Watch";
import Links from "../../Links/Links";
import CustomButton from "../../components/UI/CustomButton";
import Card from "../../components/UI/Card";
import { Layout } from "@ui-kitten/components";
import HeaderNav from "../../components/ATComponents/HeaderNav";

const generateLinkCompanyInfo = (sCode) => {
  return (
    Links.mLink +
    "watch?action=getWatchForSecurity&format=json&securityid=" +
    sCode +
    "&exchange=CSE&bookDefId=1"
  );
};

const generateLinkOrderBook = (sCode) => {
  return (
    Links.mLink +
    "marketdetails?action=getOrderBook&format=json&security=" +
    sCode +
    "&board=1"
  );
};

const generateLinkForTradeSummary = (sCode) => {
  return (
    Links.mLink +
    "marketdetails?action=getTradesSummaryOfSec&format=json&security=" +
    sCode +
    "&market=CSE&boardId=1"
  );
};

const generateLinkForPriceVolume = (sCode) => {
  return (
    Links.mLink +
    "marketdetails?action=getPriceAndVolume&format=json&security=" +
    sCode +
    "&market=CSE&bookdefid=1"
  );
};

const generateLinkForTrades = (sCode) => {
  return (
    Links.mLink +
    "marketdetails?action=getTradesOfSec&format=json&security=" +
    sCode +
    "&market=CSE&boardId=1"
  );
};

const CompanyDetailsScreen = (props) => {
  const [lastTradedValue, setLastTradedValue] = useState(
    props.route.params.tradeprice
  );

  //definition of abortcontroller

  const ac = new AbortController();
  //set fetched
  const [fetched, setFetched] = useState(false);
  const [perChange, setPerChange] = useState(props.route.params.netchange);
  const [netChange, setNetChange] = useState(props.route.params.perchange);
  const [highValue, setHighValue] = useState(props.route.params.highpx);
  const [lowValue, setLowValue] = useState(props.route.params.lowpx);
  const [totTurnOver, setTotTurnOver] = useState(
    props.route.params.totturnover
  );
  const [totVolume, setTotVolume] = useState(props.route.params.totvolume);
  const [pickerElements, setPickerElements] = useState([]);
  const [orderBookArrayBid, setOrderBookArrayBid] = useState([]);
  const [orderBookArrayAsk, setOrderBookArrayAsk] = useState([]);
  const [orderBooktotalAsk, setOrderBookTotalAsk] = useState(0);
  const [orderBooktotalBids, setOrderBookTotalBids] = useState(0);
  const [security, setSecurity] = useState(props.route.params.secCode);
  const [companyName, setCompanyName] = useState(
    props.route.params.companyname
  );
  // const [timePassed, setTimePassed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [timePassed, setTimePassed] = useState(false);
  const [trades, setTrades] = useState([]);
  const [tradeSum, setTradeSum] = useState([]);
  const [priceVol, setPriceVol] = useState();
  const [showTrades, setShowTrades] = useState(false);
  const [showTradeSum, setShowTradeSum] = useState(false);
  const [showMarketDepth, setShowMarketDepth] = useState(true);
  const [isVisibleMarketDepth, setIsVisibleMarketDepth] = useState(false);
  const [isVisibleTrades, setIsVisibleTrades] = useState(false);
  const [isVisibleTradesSummary, setIsVisibleTradesSummary] = useState(false);
  const [isVisibleSecurity, setIsVisibleSecurity] = useState(false);
  let TouchableCmp = TouchableOpacity;
  const [searchWord, setSearchWord] = useState("");
  const [searchedSecurities, setSearchedSecurities] = useState([]);

  if (Platform.OS === "android") {
    TouchableCmp = TouchableNativeFeedback;
  }

  const showMarketDepthHandler = () => {
    setIsVisibleMarketDepth(true);
  };
  const showTradesHandler = () => {
    setIsVisibleTrades(true);
  };
  const showTradeSumHandler = () => {
    setIsVisibleTradesSummary(true);
  };

  const getCompanyInfo = useCallback(async (link) => {
    try {
      const response = await fetch(link);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      setSecurity(object.data.security);
      setCompanyName(object.data.companyname);
      setLastTradedValue(object.data.tradeprice);
      setPerChange(object.data.perchange);
      setNetChange(object.data.netchange);
      setLowValue(object.data.lowpx);
      setHighValue(object.data.highpx);
      setTotTurnOver(object.data.totturnover);
      setTotVolume(object.data.totvolume);
    } catch (err) {
      throw err;
    }
  }, []);

  const getOrderBook = useCallback(async (link) => {
    try {
      const response = await fetch(link);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      if (object.data.size[0].size === "0") {
        return;
      } else {
        setOrderBookArrayBid(object.data.orderbook[0].bid);
        setOrderBookArrayAsk(object.data.orderbook[0].ask);
        setOrderBookTotalBids(object.data.orderbook[0].totalbids);
        setOrderBookTotalAsk(object.data.orderbook[0].totalask);
      }
    } catch (err) {
      throw err;
    }
  }, []);

  const tradesHandler = async (linkUrl) => {
    try {
      const responseTrades = await fetch(linkUrl);

      if (!responseTrades.ok) {
        throw new Error("Something went wrong!");
      }

      const resDataTrades = await responseTrades.text();

      let replaceStringTrades = resDataTrades.replace(/'/g, '"');

      let objectTrades = JSON.parse(replaceStringTrades);

      if (objectTrades.data.trades === undefined) {
        return;
      } else {
        setTrades(objectTrades.data.trades);
      }
    } catch (err) {
      throw err;
    }
  };

  const tradesSumHandler = async (linkUrlPriceVol, linkUrlTradeSum) => {
    try {
      const responseTradeSum = await fetch(linkUrlTradeSum);
      const responsePriceVol = await fetch(linkUrlPriceVol);

      if (!responsePriceVol.ok) {
        throw new Error("Something went wrong!");
      }
      if (!responseTradeSum.ok) {
        throw new Error("Something went wrong!");
      }

      const resDataTradeSum = await responseTradeSum.text();
      const resDataPriceVol = await responsePriceVol.text();

      let replaceStringTradeSum = resDataTradeSum.replace(/'/g, '"');
      let replaceStringPriceVol = resDataPriceVol.replace(/'/g, '"');

      let objectTradeSum = JSON.parse(replaceStringTradeSum);
      let objectPriceVol = JSON.parse(replaceStringPriceVol);

      if (objectTradeSum.data.trades === undefined) {
        return;
      } else {
        setTradeSum(objectTradeSum.data.trades);
      }

      if (objectPriceVol.data === undefined) {
        return;
      } else {
        setPriceVol(objectPriceVol.data);
      }
    } catch (err) {
      throw err;
    }
  };

  const getAllSecurityData = useCallback(async () => {
    try {
      const response = await fetch(Links.mLink + Watch.allSecurityLink);

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      setPickerElements(object.data.items);
    } catch (err) {
      throw err;
    }
  }, [setPickerElements]);

  const buyHandler = () => {
    props.navigation.navigate("BuySellScreen", {
      bOrS: "Buy",
      securityCode: security,
      securityName: companyName,
    });
  };

  const sellHandler = () => {
    props.navigation.navigate("BuySellScreen", {
      bOrS: "Sell",
      securityCode: security,
      securityName: companyName,
    });
  };

  const loadAllSecurities = useCallback(async () => {
    setIsLoading(true);
    await getAllSecurityData();
    setIsLoading(false);
  }, [setIsLoading, getAllSecurityData]);

  const searchHandler = (text) => {
    setSearchWord(text);
    let securityToUpperCase = text.toUpperCase();

    const filteredSecuritities = pickerElements.filter((sec) =>
      sec.security.match(securityToUpperCase, "g")
    );

    setSearchedSecurities(filteredSecuritities);
  };

  useEffect(() => {
    const linkUrlCompanyInfo = generateLinkCompanyInfo(security);
    const linkUrlOrderBook = generateLinkOrderBook(security);
    const linkUrlTradeSummary = generateLinkForTradeSummary(security);
    const linkUrlPriceVolume = generateLinkForPriceVolume(security);
    const linkUrlTrades = generateLinkForTrades(security);
    loadAllSecurities();
    const initialOrderBook = async () => {
      setLoadingDetails(true);
      // await getCompanyInfo(linkUrlCompanyInfo);
      // await getOrderBook(linkUrlOrderBook);
      // await tradesHandler(linkUrlTrades);
      // await tradesSumHandler(linkUrlPriceVolume, linkUrlTradeSummary);
      Promise.all([
        getCompanyInfo(linkUrlCompanyInfo),
        getOrderBook(linkUrlOrderBook),
        tradesHandler(linkUrlTrades),
        tradesSumHandler(linkUrlPriceVolume, linkUrlTradeSummary),
      ])
        .then(() => setFetched(true))
        .catch((ex) => console.error(ex));
      setLoadingDetails(false);
    };
    initialOrderBook();

    return () => {
      setLoadingDetails(false);
      ac.abort();
    };
  }, [loadAllSecurities]);

  useEffect(() => {
    const linkUrlCompanyInfo = generateLinkCompanyInfo(security);
    const linkUrlOrderBook = generateLinkOrderBook(security);
    const linkUrlTradeSummary = generateLinkForTradeSummary(security);
    const linkUrlPriceVolume = generateLinkForPriceVolume(security);
    const linkUrlTrades = generateLinkForTrades(security);
    let cleanUpVal = setTimeout(() => {
      setTimePassed((t) => !t);
      console.log("Ravindu");
    }, 5000);
    const setUpFunc = async () => {
      if (timePassed) {
        setLoadingDetails(true);
        Promise.all([
          getCompanyInfo(linkUrlCompanyInfo),
          getOrderBook(linkUrlOrderBook),
          tradesHandler(linkUrlTrades),
          tradesSumHandler(linkUrlPriceVolume, linkUrlTradeSummary),
        ])
          .then(() => setFetched(true))
          .catch((ex) => console.error(ex));
        setLoadingDetails(false);
      }
    };
    setUpFunc();

    return () => {
      clearTimeout(cleanUpVal);
      setLoadingDetails(false);
      ac.abort();
    };
  }, [timePassed]);

  const secChangeHandler = async (itemData) => {
    setIsVisibleSecurity(false);
    const linkUrlCompanyInfo = generateLinkCompanyInfo(itemData);
    const linkUrlOrderBook = generateLinkOrderBook(itemData);
    const linkUrlTradeSummary = generateLinkForTradeSummary(itemData);
    const linkUrlPriceVolume = generateLinkForPriceVolume(itemData);
    const linkUrlTrades = generateLinkForTrades(itemData);
    setSecurity(itemData);
    setLoadingDetails(true);
    await getCompanyInfo(linkUrlCompanyInfo);
    await getOrderBook(linkUrlOrderBook);
    await tradesHandler(linkUrlTrades);
    await tradesSumHandler(linkUrlPriceVolume, linkUrlTradeSummary);
    setLoadingDetails(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Layout style={{ flex: 1 }}>
      <HeaderNav
        lIconName={"arrow-back"}
        onSelectLeft={() => props.navigation.goBack()}
        rIconName={null}
        onSelectRight={null}
        headerName={"Company Details"}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, marginHorizontal: 15 }}>
        <View style={styles.pickerContainer}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setIsVisibleSecurity(true)}
            >
              <Text style={{ fontSize: 20 }}>{security}</Text>
            </TouchableOpacity>
          </View>
          <Modal visible={isVisibleSecurity}>
            <View style={styles.modalContainer}>
              <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ width: "75%" }}>
                  <SearchBar
                    platform={Platform.OS === "android" ? "android" : "ios"}
                    placeholder={"Type Here..."}
                    onChangeText={searchHandler}
                    value={searchWord}
                  />
                </View>
                <View
                  style={{
                    width: "25%",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    title="Cancel"
                    onPress={() => setIsVisibleSecurity(false)}
                  />
                </View>
              </View>
              <FlatList
                contentContainerStyle={{
                  marginHorizontal: 5,
                  paddingHorizontal: 5,
                }}
                data={searchWord === "" ? pickerElements : searchedSecurities}
                renderItem={(itemData) => (
                  <Card style={styles.touchable}>
                    <TouchableCmp
                      onPress={secChangeHandler.bind(
                        this,
                        itemData.item.security
                      )}
                    >
                      <View style={styles.cardContainer}>
                        <Text>{itemData.item.security}</Text>
                      </View>
                    </TouchableCmp>
                  </Card>
                )}
                keyExtractor={(item, index) => item.security}
              />
            </View>
          </Modal>
        </View>
        <View style={styles.companyNameContainer}>
          <Text style={styles.companyTitle}>{companyName}</Text>
        </View>
        <View style={styles.lastTradedValue}>
          {loadingDetails ? (
            <View>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : (
            <Text>Last: {lastTradedValue}</Text>
          )}
          {loadingDetails ? (
            <View>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : (
            <Text>
              {netChange}
              <Text>({perChange}%)</Text>
            </Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonColumn}>
            <CustomButton
              title="Buy"
              onPress={buyHandler}
              buttonColor={Colors.positive}
              style={styles.button}
              textColor={"white"}
            />
            <CustomButton
              title="Trades"
              onPress={showTradesHandler}
              buttonColor={Colors.none}
              style={styles.button}
              textColor={"white"}
            />
          </View>
          <View style={styles.buttonColumn}>
            <CustomButton
              title="Sell"
              onPress={sellHandler}
              buttonColor={Colors.negative}
              style={styles.button}
              textColor={"white"}
            />
            <CustomButton
              title="Trades Summary"
              onPress={showTradeSumHandler}
              buttonColor={Colors.none}
              style={styles.button}
              textColor={"white"}
            />
          </View>
          <View style={styles.buttonColumn}>
            <CustomButton
              title="Market Depth"
              onPress={showMarketDepthHandler}
              buttonColor={Colors.primary}
              style={styles.button}
              textColor={"white"}
            />
          </View>
        </View>
        <Modal visible={isVisibleMarketDepth}>
          <View style={styles.tradesContainer}>
            <ScrollView>
              <View style={styles.highLowMainContainer}>
                <View style={styles.highLowContainer}>
                  <View>
                    <Text>High</Text>
                    <Text>Turnover</Text>
                  </View>
                  <View>
                    {loadingDetails ? (
                      <View>
                        <ActivityIndicator
                          size="small"
                          color={Colors.primary}
                        />
                      </View>
                    ) : (
                      <Text>{highValue}</Text>
                    )}
                    {loadingDetails ? (
                      <View>
                        <ActivityIndicator
                          size="small"
                          color={Colors.primary}
                        />
                      </View>
                    ) : (
                      <Text>{totTurnOver}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.highLowContainer}>
                  <View>
                    <Text>Low</Text>
                    <Text>Volume</Text>
                  </View>
                  <View>
                    {loadingDetails ? (
                      <View>
                        <ActivityIndicator
                          size="small"
                          color={Colors.primary}
                        />
                      </View>
                    ) : (
                      <Text>{lowValue}</Text>
                    )}
                    {loadingDetails ? (
                      <View>
                        <ActivityIndicator
                          size="small"
                          color={Colors.primary}
                        />
                      </View>
                    ) : (
                      <Text>{totVolume}</Text>
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.totBidAskContainer}>
                <View style={styles.bidAskConatiner}>
                  <Text style={{ color: Colors.positive }}>
                    Total Bids:{" "}
                    {orderBooktotalBids
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Text>
                </View>
                <View style={styles.bidAskConatiner}>
                  <Text style={{ color: Colors.negative }}>
                    Total Asks:{" "}
                    {orderBooktotalAsk
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Text>
                </View>
              </View>
              <View style={styles.bidAskListContainer}>
                <Card style={styles.bidAskList}>
                  <View style={styles.list}>
                    <View style={{ width: "33%" }}>
                      <Text>Splits</Text>
                    </View>
                    <View style={{ width: "33%", alignItems: "center" }}>
                      <Text>Bid Qty</Text>
                    </View>
                    <View style={{ width: "33%", alignItems: "flex-end" }}>
                      <Text>Bid</Text>
                    </View>
                  </View>
                  <ScrollView>
                    {orderBookArrayBid.map((item, index) => (
                      <View style={styles.list1Container} key={index}>
                        <View style={{ width: "33%" }}>
                          <Text>{item.splits}</Text>
                        </View>
                        <View style={{ width: "33%", alignItems: "center" }}>
                          <Text>{item.qty}</Text>
                        </View>
                        <View style={{ width: "33%", alignItems: "flex-end" }}>
                          <Text>{item.price}</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </Card>
                <Card style={styles.bidAskList}>
                  <View style={styles.list}>
                    <View style={{ width: "33%" }}>
                      <Text>Splits</Text>
                    </View>
                    <View style={{ width: "33%", alignItems: "center" }}>
                      <Text>Ask Qty</Text>
                    </View>
                    <View style={{ width: "33%", alignItems: "flex-end" }}>
                      <Text>Ask</Text>
                    </View>
                  </View>
                  <ScrollView>
                    {orderBookArrayAsk.map((item, index) => (
                      <View style={styles.list1Container} key={index}>
                        <View style={{ width: "33%" }}>
                          <Text>{item.splits}</Text>
                        </View>
                        <View style={{ width: "33%", alignItems: "center" }}>
                          <Text>{item.qty}</Text>
                        </View>
                        <View style={{ width: "33%", alignItems: "flex-end" }}>
                          <Text>{item.price}</Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </Card>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  onPress={() => setIsVisibleMarketDepth(false)}
                  title="Done"
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal visible={isVisibleTrades}>
          <View style={styles.tradesContainer}>
            {priceVol && (
              <View style={styles.tradesTablePriceVol}>
                <Text>Total Trades</Text>
                <Text style={{ color: Colors.positive }}>
                  {priceVol.tottrades.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
                <Text>Total Volume</Text>
                <Text style={{ color: Colors.positive }}>
                  {priceVol.totvolume}
                </Text>
              </View>
            )}
            <Card style={{ padding: 10 }}>
              <View style={styles.tradesTable}>
                <View style={{ width: "25%", alignItems: "flex-end" }}>
                  <Text numberOfLines={1}>Trasaction Time</Text>
                </View>
                <View style={{ width: "25%", alignItems: "flex-end" }}>
                  <Text>Quantity</Text>
                </View>
                <View style={{ width: "25%", alignItems: "flex-end" }}>
                  <Text>Price</Text>
                </View>
                <View style={{ width: "25%", alignItems: "flex-end" }}>
                  <Text>Net Change</Text>
                </View>
              </View>
              {trades.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ width: "25%", alignItems: "flex-end" }}>
                    <Text>{item.transactiontime}</Text>
                  </View>
                  <View style={{ width: "25%", alignItems: "flex-end" }}>
                    <Text>{item.qty}</Text>
                  </View>
                  <View style={{ width: "25%", alignItems: "flex-end" }}>
                    <Text>{item.price}</Text>
                  </View>
                  <View style={{ width: "25%", alignItems: "flex-end" }}>
                    <Text
                      style={{
                        color:
                          parseFloat(item.netchange).toFixed(2) > 0
                            ? Colors.positive
                            : Colors.negative,
                      }}
                    >
                      {item.netchange}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button onPress={() => setIsVisibleTrades(false)} title="Done" />
            </View>
          </View>
        </Modal>
        <Modal visible={isVisibleTradesSummary}>
          <View style={styles.tradesContainer}>
            <ScrollView contentContainerStyle={{ padding: 10 }}>
              {priceVol && (
                <View style={styles.tradesTablePriceVol}>
                  <Text>Total Trades</Text>
                  <Text style={{ color: Colors.positive }}>
                    {priceVol.tottrades
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </Text>
                  <Text>Total Volume</Text>
                  <Text style={{ color: Colors.positive }}>
                    {priceVol.totvolume}
                  </Text>
                </View>
              )}
              <Card style={{ padding: 5 }}>
                <View style={styles.tradesTable}>
                  <View style={{ width: "25%" }}>
                    <Text>Trade Price</Text>
                  </View>
                  <View style={{ width: "25%" }}>
                    <Text>Trade Quantity</Text>
                  </View>
                  <View style={{ width: "25%" }}>
                    <Text>No. of Trades</Text>
                  </View>
                  <View style={{ width: "25%" }}>
                    <Text>Net Change</Text>
                  </View>
                </View>
                <View>
                  {tradeSum.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <View style={{ width: "25%" }}>
                        <Text>{item.price}</Text>
                      </View>
                      <View style={{ width: "25%" }}>
                        <Text>{item.qty}</Text>
                      </View>
                      <View style={{ width: "25%" }}>
                        <Text>{item.nooftrades}</Text>
                      </View>
                      <View style={{ width: "25%" }}>
                        <Text
                          style={{
                            color:
                              parseFloat(item.netchange).toFixed(2) > 0
                                ? Colors.positive
                                : Colors.negative,
                          }}
                        >
                          {item.netchange}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ marginVertical: 10 }}>
                  <Button
                    onPress={() => setIsVisibleTradesSummary(false)}
                    title="Set"
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
      {/* </Layout> */}
    </Layout>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",

    backgroundColor: "white",
  },
  tradesContainer: {
    flex: 1,
    marginVertical: 20,
    justifyContent: "center",
  },
  tradesTable: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  tradesTablePriceVol: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  buttonColumn: {
    width: "30%",
    marginVertical: 10,
  },
  button: {
    marginVertical: 5,
  },
  touchable: {
    overflow: "hidden",
  },
  pickerContainer: {
    height: Platform.OS === "android" ? "7.5%" : "20%",
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 15,
    backgroundColor: Colors.white,
  },
  modalContainer: {
    flex: 1,
  },
  companyNameContainer: {
    height: "4%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  companyTitle: {
    fontSize: 18,
  },
  lastTradedValue: {
    height: "8%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  highLowMainContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 15,
  },
  highLowContainer: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 4,
  },
  totBidAskContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 8,
  },
  bidAskConatiner: {
    width: "48%",
    marginHorizontal: 4,
  },
  bidAskListContainer: {
    flexDirection: "row",
    width: "100%",
  },
  bidAskList: {
    width: "48%",
    marginHorizontal: 4,
    padding: 10,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list1Container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContainer: {
    padding: 20,
  },
});

export default CompanyDetailsScreen;
