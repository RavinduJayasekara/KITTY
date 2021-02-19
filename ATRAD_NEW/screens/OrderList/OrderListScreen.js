import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Button,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/ATComponents/HeaderButton";
import HeaderNav from "../../components/ATComponents/HeaderNav";
import Card from "../../components/UI/Card";
import * as loadingclientActions from "../../store/action/loadingclients";
import Colors from "../../constants/Colors";
import Links from "../../Links/Links";

const allCategoryArray = [
  { label: "ALL", value: "all" },
  { label: "NEW", value: "NEW" },
  { label: "P.FILLED", value: "P.FILLED" },
  { label: "FILLED", value: "FILLED" },
  { label: "CANCELLED", value: "CANCELLED" },
  { label: "AMENDED", value: "AMENDED" },
  { label: "QUEUED", value: "QUEUED" },
  { label: "Q.AMEND", value: "Q.AMEND" },
  { label: "EXPIRED", value: "EXPIRED" },
  { label: "REJECTED", value: "REJECTED" },
  { label: "PENDING", value: "PENDING" },
];

const generateUrlForOrderList = (client, catergory) => {
  let accountLink = "";

  if (client === "all") {
    accountLink = "all";
  } else {
    const clientCodeSplitArray = client.split("/");

    accountLink =
      clientCodeSplitArray[0] +
      "%2F" +
      clientCodeSplitArray[1] +
      "%2F" +
      clientCodeSplitArray[2];
  }
  return (
    Links.mLink +
    "order?action=getBlotterData&format=json&exchange=CSE&clientAcc=" +
    accountLink +
    "&ordStatus=" +
    catergory +
    "&ordType=all"
  );
};

const OrderListScreen = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleClients, setIsVisibleClients] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const allClients = useSelector((state) => state.loadingclients.allClients);
  const clientArray = [{ label: "All Clients", value: "all" }];
  const [cCodeVal, setCCodeVal] = useState("");
  const [catergory, setCategory] = useState("");
  const [blotterData, setBlotterData] = useState([]);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [isVisibleAmend, setIsVisibleAmend] = useState(false);
  const [isVisibleCancel, setIsVisibleCancel] = useState(false);
  const [isVisibleDetail, setIsVisibleDetail] = useState(false);
  const [isVisibleHistory, setIsVisibleHistory] = useState(false);
  const [security, setSecurity] = useState("");
  const [side, setSide] = useState("");
  const [orderQty, setOrderQty] = useState("");
  const [orderPrice, setOrderPrice] = useState("");
  const [orderValue, setOrderValue] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [remainder, setRemainder] = useState("");
  const [accoundId, setAccountId] = useState("");
  const [contraBroker, setContraBroker] = useState("");
  const [boardId, setBoardId] = useState("");
  const [filledQty, setFilledQty] = useState("");
  const [averagePrice, setAveragePrice] = useState("");
  const [orderSource, setOrderSource] = useState("");
  const [tif, setTIF] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [discloseQty, setDiscloseQty] = useState("");
  const [minimumQty, setMinimumQty] = useState("");
  const [orderDateTime, setOrderDateTime] = useState("");
  const [clientOrderId, setClientOrderId] = useState("");
  const [lastChangeTime, setLastChangeTime] = useState("");
  const [executionId, setExecutionId] = useState("");
  const [exchange, setExchange] = useState("");
  const [exchangeOrderId, setExchangeOrderId] = useState("");
  const [clientBroker, setClientBroker] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [sessionManage, setSessionManage] = useState(false);

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

  const clientPickerHandler = (value) => {
    setCCodeVal(value);
  };

  const categoryPickerHandler = (value) => {
    setCategory(value);
  };

  const loadAllClients = useCallback(async () => {
    setIsLoading(true);
    await dispatch(loadingclientActions.fetchClients());
    setIsLoading(false);
  }, [setIsLoading]);

  const getInformationAboutOrders = async (link) => {
    try {
      const responseOrderList = await fetch(link);

      if (!responseOrderList.ok) {
        throw new Error("Something went wrong!");
      }

      const resDataOrderList = await responseOrderList.text();

      let replaceStringOrderList = resDataOrderList.replace(/'/g, '"');
      let objectOrderList = JSON.parse(replaceStringOrderList);

      setBlotterData(objectOrderList.data.blotterdata);
    } catch (error) {
      setSessionManage(false);
    }
  };

  const amendOrderHandler = () => {
    setIsOrderModalVisible(false);
  };

  const cancelOrderHandler = () => {
    setIsOrderModalVisible(false);
  };

  const detailOrderHandler = () => {
    setIsOrderModalVisible(false);
    setIsVisibleDetail(true);
  };

  const historyOrderHandler = () => {
    setIsOrderModalVisible(false);
    setIsVisibleHistory(true);
  };

  const orderDetailHandler = (secCode) => {
    setIsOrderModalVisible(true);
    const selectedSecurity = blotterData.find(
      (sec) => sec.securitycode === secCode
    );
    setSecurity(selectedSecurity.securitycode);
    setSide(selectedSecurity.action);
    setOrderQty(selectedSecurity.disclosequantity);
    setOrderPrice(selectedSecurity.orderprice);
    setOrderValue(selectedSecurity.orderprice);
    setOrderStatus(selectedSecurity.orderStatus);
    setRemainder(selectedSecurity.remainder);
    setAccountId(selectedSecurity.clientaccountcode);
    setContraBroker(selectedSecurity.contrabroker);
    setBoardId(selectedSecurity.board);
    setFilledQty(selectedSecurity.filledquantity);
    setAveragePrice(selectedSecurity.averageprice);
    setOrderSource(selectedSecurity.ordersource);
    setTIF(selectedSecurity.timeinforce);
    setExpiryDate(selectedSecurity.tifremainingdays);
    setDiscloseQty(selectedSecurity.disclosequantity);
    setMinimumQty(selectedSecurity.minimumquantity);
    setOrderDateTime(selectedSecurity.orderplacedate);
    setClientOrderId(selectedSecurity.clientorderid);
    setLastChangeTime(selectedSecurity.lastupdatedtime);
    setExecutionId(selectedSecurity.orderexecutionid);
    setExchange(selectedSecurity.exchangeid);
    setExchangeOrderId(selectedSecurity.exchangeorderid);
    setClientBroker(selectedSecurity.brokerclient);
    setRejectReason(selectedSecurity.rejectreason);
  };

  const getInfoOrderList = useCallback(async () => {
    setIsLoading(true);
    if (cCodeVal !== "" && catergory !== "") {
      const urlForOrderList = generateUrlForOrderList(cCodeVal, catergory);
      await getInformationAboutOrders(urlForOrderList);
    }
    setIsLoading(false);
  }, [cCodeVal, catergory]);

  useEffect(() => {
    getInfoOrderList();
    props.navigation.addListener("focus", getInfoOrderList);
  }, [getInfoOrderList]);

  useEffect(() => {
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
    loadAllClients();
  }, [loadAllClients]);

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
      <HeaderNav
        lIconName={"menu-outline"}
        onSelectLeft={() => props.navigation.toggleDrawer()}
        rIconName={"search-outline"}
        onSelectRight={() => {}}
        headerName={"Order List"}
      />
      {Platform.OS === "android" ? (
        <View style={styles.dropDownContainer}>
          <View style={{ width: "50%", backgroundColor: "white" }}>
            {clientArray.length !== 0 ? (
              <Picker
                style={{ width: "98%" }}
                selectedValue={
                  cCodeVal === ""
                    ? clientPickerHandler(clientArray[0].value)
                    : cCodeVal
                }
                onValueChange={clientPickerHandler}
              >
                {clientArray.map((item, index) => (
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
          <View style={{ width: "50%", backgroundColor: "white" }}>
            <Picker
              style={{ width: "98%" }}
              selectedValue={
                catergory === ""
                  ? categoryPickerHandler(allCategoryArray[0].value)
                  : catergory
              }
              onValueChange={categoryPickerHandler}
            >
              {allCategoryArray.map((item, index) => (
                <Picker.Item
                  label={item.label}
                  value={item.value}
                  key={index}
                />
              ))}
            </Picker>
          </View>
        </View>
      ) : (
        <View style={styles.dropDownContainer}>
          <Modal visible={isVisible} transparent={true} animationType={"slide"}>
            <View style={styles.modalContainer}>
              <View
                style={{
                  flexGrow: 1,
                  backgroundColor: "black",
                  opacity: 0.4,
                }}
              ></View>
              <View style={styles.contentContainer}>
                <View style={styles.actions}>
                  <View>
                    <Button
                      title="Cancel"
                      onPress={() => setIsVisible(false)}
                    />
                  </View>
                  <View>
                    <Button title="Done" onPress={() => setIsVisible(false)} />
                  </View>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={
                      catergory === ""
                        ? categoryPickerHandler(allCategoryArray[0].value)
                        : catergory
                    }
                    onValueChange={categoryPickerHandler}
                  >
                    {allCategoryArray.map((item, index) => (
                      <Picker.Item
                        label={item.label}
                        value={item.value}
                        key={index}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            visible={isVisibleClients}
            transparent={true}
            animationType={"slide"}
          >
            <View style={styles.modalContainer}>
              <View
                style={{
                  flexGrow: 1,
                  backgroundColor: "black",
                  opacity: 0.4,
                }}
              ></View>
              <View style={styles.contentContainer}>
                <View style={styles.actions}>
                  <View>
                    <Button
                      title="Cancel"
                      onPress={() => setIsVisibleClients(false)}
                    />
                  </View>
                  <View>
                    <Button
                      title="Done"
                      onPress={() => setIsVisibleClients(false)}
                    />
                  </View>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker>
                    {clientArray.map((item, index) => (
                      <Picker.Item
                        label={item.label}
                        value={item.value}
                        key={index}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => setIsVisibleClients(true)}
          >
            <Text>Ravindu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => setIsVisible(true)}
          >
            <Text>Ravindu</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.ordersContainer}>
        {blotterData &&
          blotterData.length !== 0 &&
          blotterData.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.orderTile}
                onPress={orderDetailHandler.bind(this, item.securitycode)}
              >
                <View>
                  <Text>{item.securitycode}</Text>
                  <Text>
                    {item.action} ({item.timeinforce})
                  </Text>
                </View>
                <View style={styles.tileAssemble}>
                  <View style={styles.innerStyleTileAssemble}>
                    <Text>{item.orderStatus}</Text>
                    <Text>
                      {item.orderprice} x {item.disclosequantity}
                    </Text>
                  </View>
                  <View>
                    <Ionicons
                      name={
                        Platform.OS === "android"
                          ? "md-arrow-dropright"
                          : "ios-arrow-dropright"
                      }
                      size={25}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        <Modal visible={isOrderModalVisible} transparent={true}>
          <View style={styles.ordersModal}>
            <Card style={styles.ordersCard}>
              <TouchableOpacity
                style={{
                  ...styles.ordersOpacity,
                  ...{ backgroundColor: Colors.primary },
                }}
                onPress={amendOrderHandler}
              >
                <Text style={styles.ordersTitle}>Amend Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.ordersOpacity,
                  ...{ backgroundColor: Colors.negative },
                }}
                onPress={cancelOrderHandler}
              >
                <Text style={styles.ordersTitle}>Cancel Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.ordersOpacity,
                  ...{ backgroundColor: Colors.none },
                }}
                onPress={detailOrderHandler}
              >
                <Text style={styles.ordersTitle}>Order Detail</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.ordersOpacity,
                  ...{ backgroundColor: Colors.accent },
                }}
                onPress={historyOrderHandler}
              >
                <Text style={styles.ordersTitle}>History</Text>
              </TouchableOpacity>
            </Card>
          </View>
        </Modal>
        <Modal visible={isVisibleAmend}></Modal>
        <Modal visible={isVisibleCancel}></Modal>
        <Modal visible={isVisibleDetail}>
          <View style={styles.container}>
            <View
              style={{
                width: "100%",
                alignItems: "flex-end",
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  borderRadius: 25,
                  backgroundColor: "#ccc",
                  padding: 5,
                }}
              >
                <Ionicons
                  size={25}
                  name={Platform.OS === "android" ? "md-close" : "ios-close"}
                  onPress={() => setIsVisibleDetail(false)}
                />
              </View>
            </View>
            <View style={{ flexDirection: "row", width: "100%", padding: 20 }}>
              <View style={{ width: "50%" }}>
                <Text>Security ID</Text>
                <Text>Side</Text>
                <Text>Order Qty</Text>
                <Text>Order Price</Text>
                <Text>Order Value</Text>
                <Text>Order Status</Text>
                <Text>Remaining Qty</Text>
                <Text>Account Id</Text>
                <Text>Contra Broker</Text>
                <Text>Board ID</Text>
                <Text>Filled Qty</Text>
                <Text>Average Price</Text>
                <Text>Order Source</Text>
                <Text>TIF</Text>
                <Text>Expiry Date</Text>
                <Text>Disclose Qty</Text>
                <Text>Minimum Qty</Text>
                <Text>Order Date {"&"} Time</Text>
                <Text>Client Order ID</Text>
                <Text>Last Change Time</Text>
                <Text>Execution ID</Text>
                <Text>Exchange</Text>
                <Text>Exchange Order ID</Text>
                <Text>Client Broker</Text>
                <Text>Reject Reason</Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text>{security}</Text>
                <Text>{side}</Text>
                <Text>{orderQty}</Text>
                <Text>{orderPrice}</Text>
                <Text>{orderValue}</Text>
                <Text>{orderStatus}</Text>
                <Text>{remainder}</Text>
                <Text>{accoundId}</Text>
                <Text>{contraBroker}</Text>
                <Text>{boardId}</Text>
                <Text>{filledQty}</Text>
                <Text>{averagePrice}</Text>
                <Text>{orderSource}</Text>
                <Text>{tif}</Text>
                <Text>{expiryDate}</Text>
                <Text>{discloseQty}</Text>
                <Text>{minimumQty}</Text>
                <Text>{orderDateTime}</Text>
                <Text>{clientOrderId}</Text>
                <Text>{lastChangeTime}</Text>
                <Text>{executionId}</Text>
                <Text>{exchange}</Text>
                <Text>{exchangeOrderId}</Text>
                <Text>{clientBroker}</Text>
                <Text>{rejectReason}</Text>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={isVisibleHistory}>
          <View style={styles.container}>
            <View
              style={{
                width: "100%",
                alignItems: "flex-end",
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  borderRadius: 25,
                  backgroundColor: "#ccc",
                  padding: 5,
                }}
              >
                <Ionicons
                  size={25}
                  name={Platform.OS === "android" ? "md-close" : "ios-close"}
                  onPress={() => setIsVisibleHistory(false)}
                />
              </View>
            </View>
            <View style={{ flexDirection: "row", width: "100%", padding: 20 }}>
              <View style={{ width: "50%" }}>
                <Text>Security ID</Text>
                <Text>Side</Text>
                <Text>Order Qty</Text>
                <Text>Order Price</Text>
                <Text>Order Status</Text>
                <Text>TIF</Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text>{security}</Text>
                <Text>{side}</Text>
                <Text>{orderQty}</Text>
                <Text>{orderPrice}</Text>
                <Text>{orderStatus}</Text>
                <Text>{tif}</Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ordersOpacity: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  ordersTitle: {
    color: "white",
    fontSize: 25,
  },
  ordersCard: {
    padding: 25,
    paddingHorizontal: 35,
  },
  ordersModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderTile: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  tileAssemble: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
  },
  innerStyleTileAssemble: {
    marginHorizontal: 10,
  },
  ordersContainer: { flex: 1 },
  dropDownContainer: {
    width: "100%",
    flexDirection: "row",
  },
  container: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: "#F194FF",
    padding: 15,
    borderRadius: 10,
    width: "50%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  contentContainer: {
    // backgroundColor: "white",
    borderRadius: 10,
  },
  pickerContainer: {
    justifyContent: "flex-end",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderListScreen;
