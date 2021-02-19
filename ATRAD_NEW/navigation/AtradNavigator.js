import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { createStackNavigator, useHeaderHeight } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  Drawer,
  DrawerItem,
  IndexPath,
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
} from "@ui-kitten/components";

import HeaderButton from "../components/ATComponents/HeaderButton";
import AnnouncementsScreen from "../screens/MarketInfo/AnnouncementsScreen";
import BrokerScreen from "../screens/MarketInfo/BrokerScreen";
import CSEScreen from "../screens/MarketInfo/CSEScreen";
import GainersScreen from "../screens/MarketInfo/GainersScreen";
import IndicesSummaryScreen from "../screens/MarketInfo/IndicesSummaryScreen";
import LosersScreen from "../screens/MarketInfo/LosersScreen";
import MarketInfoScreen from "../screens/MarketInfo/MarketInfoScreen";
import ShareVolumeScreen from "../screens/MarketInfo/ShareVolumeScreen";
import TradeSummaryScreen from "../screens/MarketInfo/TradeSummaryScreen";
import TurnOverScreen from "../screens/MarketInfo/TurnOverScreen";
import OrderListScreen from "../screens/OrderList/OrderListScreen";
import PortfolioSummaryScreen from "../screens/PortfolioSummary/PortfolioSummaryScreen";
import SelectedWatchScreen from "../screens/SelectedWatch/SelectedWatchScreen";
import AccountSummaryScreen from "../screens/More/AccountSummaryScreen";
import ChartScreen from "../screens/More/ChartScreen";
import SettingsScreen from "../screens/More/SettingsScreen";
import WatchListScreen from "../screens/SelectedWatch/WatchListScreen";
import Colors from "../constants/Colors";
import CompanyDetailsScreen from "../screens/SelectedWatch/CompanyDetailsScreen";
import BuySellScreen from "../screens/SelectedWatch/BuySellScreen";
import SignoutScreen from "../screens/Authentication/SignoutScreen";
import LoginScreen from "../screens/Authentication/LoginScreen";
import * as authActions from "../store/action/auth";
import SearchWindow from "../screens/More/SearchWindow";
import { Button, View } from "react-native";

const changeScreenOrientationToPortrait = async () => {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
};

const marketSummLeftIcon = () => (
  <Icon name="arrow-back" fill={Colors.white} style={styles.icon} />
);
const topStocksLeftIcon = () => (
  <Icon name="arrow-back" fill={Colors.white} style={styles.icon} />
);
const MarketInfoStack = createStackNavigator();

const MarketInfoStackNavigator = (props) => {
  return (
    <MarketInfoStack.Navigator headerMode="screen">
      <MarketInfoStack.Screen
        name="MarketInfoScreen"
        component={MarketInfoScreen}
        options={{ headerShown: false }}
      />
      <MarketInfoStack.Screen
        name="AnnouncementsScreen"
        component={AnnouncementsScreen}
        options={{ headerShown: false }}
      />
      <MarketInfoStack.Screen name="BrokerScreen" component={BrokerScreen} />
      <MarketInfoStack.Screen name="CSEScreen" component={CSEScreen} />
      <MarketInfoStack.Screen
        name="MarketSummaryStackNavigator"
        component={MarketSummaryStackNavigator}
      />
      <MarketInfoStack.Screen
        name={"SearchWindowScreen"}
        component={SearchWindow}
      />
      <MarketInfoStack.Screen
        name="TopStocksStackNavigator"
        component={TopStocksStackNavigator}
      />

      <MarketInfoStack.Screen
        name="MarketSummaryTabNavigator"
        component={MarketSummaryTabNavigator}
        options={(props) => ({
          header: ({ scene, previous, navigation }) => {
            const { options } = scene.descriptor;

            const marketSummaryLeftFunction = () => (
              <TopNavigationAction
                icon={marketSummLeftIcon}
                onPress={() => props.navigation.goBack()}
              />
            );

            return (
              <Layout
                level="1"
                style={
                  (options.headerStyle = {
                    minHeight: 128,
                    justifyContent: "center",
                  })
                }
              >
                <TopNavigation
                  title={() => <Text style={styles.text}>Market Summary</Text>}
                  alignment="center"
                  accessoryLeft={marketSummaryLeftFunction}
                />
              </Layout>
            );
          },
        })}
      />

      <MarketInfoStack.Screen
        name="TopStocksTabNavigator"
        component={TopStocksTabNavigator}
        options={(props) => ({
          header: ({ scene, previous, navigation }) => {
            const { options } = scene.descriptor;

            const topStocksLeftFunction = () => (
              <TopNavigationAction
                icon={topStocksLeftIcon}
                onPress={() => props.navigation.goBack()}
              />
            );

            return (
              <Layout
                level="1"
                style={
                  (options.headerStyle = {
                    minHeight: 128,
                    justifyContent: "center",
                  })
                }
              >
                {/* <Layout style={styles.headerStyles}> */}
                <TopNavigation
                  title={() => <Text style={styles.text}>Top Stocks</Text>}
                  alignment="center"
                  accessoryLeft={topStocksLeftFunction}
                />
                {/* </Layout> */}
              </Layout>
            );
          },
        })}
      />
    </MarketInfoStack.Navigator>
  );
};

// const TopTabBar;

const MarketSummaryTab = createMaterialTopTabNavigator();

const MarketSummaryTabNavigator = () => {
  return (
    <MarketSummaryTab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "white",
      }}
      // tabBar={}
    >
      <MarketSummaryTab.Screen
        name="TradeSummaryScreen"
        component={TradeSummaryScreen}
        options={{ tabBarLabel: "Trade Summary" }}
      />
      <MarketSummaryTab.Screen
        name="IndicesSummaryScreen"
        component={IndicesSummaryScreen}
        options={{ tabBarLabel: "Indices Summary" }}
      />
    </MarketSummaryTab.Navigator>
  );
};

const MarketSummaryStack = createStackNavigator();

const MarketSummaryStackNavigator = () => {
  return (
    <MarketSummaryStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "white",
      }}
    >
      <MarketSummaryStack.Screen
        name="MarketSummaryTabNavigator"
        component={MarketSummaryTabNavigator}
      />
    </MarketSummaryStack.Navigator>
  );
};

const TopStocksTab = createMaterialTopTabNavigator();

const TopStocksTabNavigator = () => {
  return (
    <TopStocksTab.Navigator>
      <TopStocksTab.Screen
        name="GainersScreen"
        component={GainersScreen}
        options={{ tabBarLabel: "Gainers" }}
      />
      <TopStocksTab.Screen
        name="LosersScreen"
        component={LosersScreen}
        options={{ tabBarLabel: "Losers" }}
      />
      <TopStocksTab.Screen
        name="TurnOverScreen"
        component={TurnOverScreen}
        options={{ tabBarLabel: "Turn Over" }}
      />
      <TopStocksTab.Screen
        name="ShareVolumeScreen"
        component={ShareVolumeScreen}
        options={{ tabBarLabel: "Share Volume" }}
      />
    </TopStocksTab.Navigator>
  );
};

const TopStocksStack = createStackNavigator();

const TopStocksStackNavigator = (props) => {
  return (
    <TopStocksStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
      }}
    >
      <TopStocksStack.Screen
        name="TopStocksTabNavigator"
        component={TopStocksTabNavigator}
        listeners={(props) => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
        options={(props) => ({
          headerLeft: () => {
            return (
              <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                  iconName="ios-menu"
                  onPress={() => {
                    props.navigation.toggleDrawer();
                  }}
                />
              </HeaderButtons>
            );
          },
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
        })}
      />
      <TopStocksStack.Screen
        name={"SearchWindowScreen"}
        component={SearchWindow}
      />
    </TopStocksStack.Navigator>
  );
};

const OrderListStack = createStackNavigator();

const OrderListStackNavigator = () => {
  return (
    <OrderListStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "white",
      }}
      headerMode="none"
    >
      <OrderListStack.Screen
        name="OrderListScreen"
        component={OrderListScreen}
      />
      <OrderListStack.Screen
        name={"SearchWindowScreen"}
        component={SearchWindow}
      />
    </OrderListStack.Navigator>
  );
};

const PortfolioSummaryStack = createStackNavigator();

const PortfolioSummaryStackNavigator = () => {
  return (
    <PortfolioSummaryStack.Navigator headerMode="none">
      <PortfolioSummaryStack.Screen
        name="PortfolioSummaryScreen"
        component={PortfolioSummaryScreen}
        options={(props) => ({
          headerLeft: () => {
            return (
              <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                  iconName="ios-menu"
                  onPress={() => {
                    props.navigation.toggleDrawer();
                  }}
                />
              </HeaderButtons>
            );
          },
        })}
      />
      <PortfolioSummaryStack.Screen
        name={"SearchWindowScreen"}
        component={SearchWindow}
      />
    </PortfolioSummaryStack.Navigator>
  );
};

const SelectWatchStack = createStackNavigator();

const SelectWatchStackNavigator = () => {
  return (
    <SelectWatchStack.Navigator headerMode="none">
      <SelectWatchStack.Screen
        name="SelectedWatchScreen"
        component={SelectedWatchScreen}
        options={(props) => ({
          headerLeft: () => {
            return (
              <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                  iconName="ios-menu"
                  onPress={() => {
                    props.navigation.toggleDrawer();
                  }}
                />
              </HeaderButtons>
            );
          },
        })}
      />
      <SelectWatchStack.Screen
        name="WatchListScreen"
        component={WatchListScreen}
      />
      <SelectWatchStack.Screen
        name="CompanyDetailsScreen"
        component={CompanyDetailsScreen}
      />
      <SelectWatchStack.Screen
        name="SearchWindowScreen"
        component={SearchWindow}
      />
      <SelectWatchStack.Screen
        name="BuySellScreen"
        component={BuySellScreen}
        options={{ headerTitle: "Trading Screen" }}
      />
    </SelectWatchStack.Navigator>
  );
};

const AccountSummaryStack = createStackNavigator();

const AccountSummaryStackNavigator = () => {
  return (
    <AccountSummaryStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "white",
      }}
      headerMode="none"
    >
      <AccountSummaryStack.Screen
        name="AccountSummaryScreen"
        component={AccountSummaryScreen}
        options={(props) => ({
          headerLeft: () => {
            return (
              <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                  iconName="ios-menu"
                  onPress={() => {
                    props.navigation.toggleDrawer();
                  }}
                />
              </HeaderButtons>
            );
          },
        })}
      />
      <AccountSummaryStack.Screen
        name={"SearchWindowScreen"}
        component={SearchWindow}
      />
    </AccountSummaryStack.Navigator>
  );
};

const ChartStack = createStackNavigator();

const ChartStackNavigator = () => {
  return (
    <ChartStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "white",
      }}
    >
      <ChartStack.Screen
        name="ChartScreen"
        component={ChartScreen}
        options={(props) => ({
          headerLeft: () => {
            return (
              <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                  iconName="ios-menu"
                  onPress={() => {
                    props.navigation.toggleDrawer();
                  }}
                />
              </HeaderButtons>
            );
          },
        })}
      />
    </ChartStack.Navigator>
  );
};

const SettingsStack = createStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "white",
      }}
      headerMode="none"
    >
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={(props) => ({
          headerLeft: () => {
            return (
              <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                  iconName="ios-menu"
                  onPress={() => {
                    props.navigation.toggleDrawer();
                  }}
                />
              </HeaderButtons>
            );
          },
        })}
      />
    </SettingsStack.Navigator>
  );
};

const DefaultTab = createBottomTabNavigator();

const DefaultTabNavigator = (props) => {
  return (
    <DefaultTab.Navigator
      initialRouteName={props.route.params.routeScreen}
      tabBarOptions={{ activeTintColor: Colors.primary }}
    >
      <DefaultTab.Screen
        name="MarketInfoStackNavigator"
        component={MarketInfoStackNavigator}
        options={{
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="ios-information-circle"
                size={23}
                color={tabInfo.color}
              />
            );
          },
          tabBarLabel: "Market Info",
        }}
        listeners={(props) => ({
          tabPress: (e) => {
            e.preventDefault();
            props.navigation.jumpTo("MarketInfo");
          },
        })}
      />
      <DefaultTab.Screen
        name="OrderListStackNavigator"
        component={OrderListStackNavigator}
        options={{
          tabBarIcon: (tabInfo) => {
            return <Ionicons name="ios-list" size={23} color={tabInfo.color} />;
          },
          tabBarLabel: "Order List",
        }}
        listeners={(props) => ({
          tabPress: (e) => {
            e.preventDefault();
            props.navigation.jumpTo("OrderList");
          },
        })}
      />
      <DefaultTab.Screen
        name="PortfolioSummaryStackNavigator"
        component={PortfolioSummaryStackNavigator}
        options={{
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons name="ios-briefcase" size={23} color={tabInfo.color} />
            );
          },
          tabBarLabel: "Portfolio Summary",
        }}
        listeners={(props) => ({
          tabPress: (e) => {
            e.preventDefault();
            props.navigation.jumpTo("PortfolioSummary");
          },
        })}
      />
      <DefaultTab.Screen
        name="SelectWatchStackNavigator"
        component={SelectWatchStackNavigator}
        options={{
          tabBarIcon: (tabInfo) => {
            return (
              <FontAwesome5 name="chart-line" size={23} color={tabInfo.color} />
            );
          },
          tabBarLabel: "Selected Watch",
        }}
        listeners={(props) => ({
          tabPress: (e) => {
            e.preventDefault();
            props.navigation.jumpTo("SelectedWatch");
          },
        })}
      />
    </DefaultTab.Navigator>
  );
};

//Icons Definition for the drawer

const MarketInfo = (props) => (
  <Icon {...props} name="info-outline" animation="shake" />
);

const ChartIcon = (props) => (
  <Icon {...props} name="bar-chart-outline" animation="shake" />
);
const SettingsIcon = (props) => (
  <Icon {...props} name="settings-outline" animation="shake" />
);
const PortfolioSummaryIcon = (props) => (
  <Icon {...props} name="briefcase-outline" animation="shake" />
);
const SelectedWatchIcon = (props) => (
  <Icon {...props} name="list-outline" animation="shake" />
);
const AccountSummaryIcon = (props) => (
  <Icon {...props} name="activity-outline" animation="shake" />
);
const OrderListIcon = (props) => (
  <Icon {...props} name="shopping-cart-outline" animation="shake" />
);
const TopStocksIcon = (props) => (
  <Icon {...props} name="bar-chart-outline" animation="shake" />
);
const SignOutIcon = (props) => (
  <Icon {...props} name="log-out-outline" animation="shake" />
);

const ForwardIcon = (props) => <Icon {...props} name="arrow-ios-forward" />;

const Header = (props) => (
  <React.Fragment>
    <ImageBackground
      style={[props.style, styles.header]}
      source={{
        uri:
          "data:image/png;base64,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",
      }}
      resizeMode="contain"
    />
    <Divider />
  </React.Fragment>
);

const DrawerContent = ({ navigation, state }) => (
  <Drawer
    header={Header}
    selectedIndex={new IndexPath(state.index)}
    onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
  >
    <DrawerItem
      title="Market Info"
      accessoryLeft={MarketInfo}
      accessoryRight={ForwardIcon}
    />
    <DrawerItem
      title="Order List"
      accessoryLeft={ChartIcon}
      accessoryRight={ForwardIcon}
    />
    <DrawerItem
      title="Portfolio Summary"
      accessoryLeft={SettingsIcon}
      accessoryRight={ForwardIcon}
    />
    <DrawerItem
      title="Selected Watch"
      accessoryLeft={PortfolioSummaryIcon}
      accessoryRight={ForwardIcon}
    />
    <DrawerItem
      title="Top Stocks"
      accessoryLeft={SelectedWatchIcon}
      accessoryRight={ForwardIcon}
    />
    <DrawerItem
      title="Account Summary"
      accessoryLeft={AccountSummaryIcon}
      accessoryRight={ForwardIcon}
    />
    <DrawerItem
      title="Charts"
      accessoryLeft={OrderListIcon}
      accessoryRight={ForwardIcon}
    />
    <DrawerItem
      title="Settings"
      accessoryLeft={TopStocksIcon}
      accessoryRight={ForwardIcon}
    />
    <DrawerItem
      title="Sign Out"
      accessoryLeft={SignOutIcon}
      accessoryRight={ForwardIcon}
    />
  </Drawer>
);

const DefaultDrawer = createDrawerNavigator();

const DefaultDrawerNavigator = () => {
  const dispatch = useDispatch();

  return (
    <DefaultDrawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName="SelectedWatch"
      drawerContentOptions={{
        activeTintColor: Colors.primary,
      }}
    >
      <DefaultDrawer.Screen
        initialParams={{ routeScreen: "MarketInfoStackNavigator" }}
        name="MarketInfo"
        component={DefaultTabNavigator}
        // listeners = {}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <Ionicons
                name="ios-information-circle"
                size={23}
                color={drawerInfo.color}
              />
            );
          },
          drawerLabel: "Market Info",
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        initialParams={{ routeScreen: "OrderListStackNavigator" }}
        name="OrderList"
        component={DefaultTabNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <FontAwesome5
                name="chart-line"
                size={23}
                color={drawerInfo.color}
              />
            );
          },
          drawerLabel: "Order List",
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        initialParams={{ routeScreen: "PortfolioSummaryStackNavigator" }}
        name="PortfolioSummary"
        component={DefaultTabNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <Ionicons
                name="ios-briefcase"
                size={23}
                color={drawerInfo.color}
              />
            );
          },
          drawerLabel: "Portfolio Summary",
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        initialParams={{ routeScreen: "SelectWatchStackNavigator" }}
        name="SelectedWatch"
        component={DefaultTabNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <Ionicons name="ios-list" size={23} color={drawerInfo.color} />
            );
          },
          drawerLabel: "Selected Watch",
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        name="TopStocksStackNavigator"
        component={TopStocksStackNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <AntDesign name="totop" size={23} color={drawerInfo.color} />
            );
          },
          drawerLabel: "Top Stocks",
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        name="AccountSummaryStackNavigator"
        component={AccountSummaryStackNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <Ionicons name="ios-wallet" size={23} color={drawerInfo.color} />
            );
          },
          drawerLabel: "Account Summary",
          unmountOnBlur: true,
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        name="ChartStackNavigator"
        component={ChartStackNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <FontAwesome5
                name="chart-area"
                size={23}
                color={drawerInfo.color}
              />
            );
          },
          drawerLabel: "Charts",
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        name="SettingsStackNavigator"
        component={SettingsStackNavigator}
        options={{
          drawerIcon: (drawerInfo) => {
            return (
              <Ionicons
                name="ios-settings"
                size={23}
                color={drawerInfo.color}
              />
            );
          },
          drawerLabel: "Settings",
        }}
        listeners={() => ({
          focus: () => changeScreenOrientationToPortrait(),
        })}
      />
      <DefaultDrawer.Screen
        name="SignoutScreen"
        component={SignoutScreen}
        listeners={{ focus: () => dispatch(authActions.signOut()) }}
        options={{ drawerLabel: "Sign Out" }}
      />
    </DefaultDrawer.Navigator>
  );
};
const LoginStack = createStackNavigator();

const LoginStackNavigator = () => {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        name={"LoginScreen"}
        component={LoginScreen}
        options={{
          headerTitle: "Login",
          headerTintColor: "white",
          headerStyle: { backgroundColor: Colors.primary },
        }}
      />
    </LoginStack.Navigator>
  );
};

const AtradNavigator = () => {
  const userToken = useSelector((state) => state.auth.userToken);

  return (
    <NavigationContainer>
      {userToken == null ? <LoginStackNavigator /> : <DefaultDrawerNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 128,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: { height: 32, width: 32 },
  headerStyles: { height: "100%" },
  text: {
    fontSize: 20,
  },
});

export default AtradNavigator;
