import React from "react";
import AtradNavigator from "./navigation/AtradNavigator";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, combineReducers } from "redux";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import ReduxThunk from "redux-thunk";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from "@ui-kitten/components";

import topStocksReducer from "./store/reducer/topStocks";
import loginReducer from "./store/reducer/login";
import marketsummaryReducer from "./store/reducer/marketsummary";
import dropdownSecuritiesReducer from "./store/reducer/dropdownsecurities";
import loadingclientsReducer from "./store/reducer/loadingclients";
import authReducer from "./store/reducer/auth";
import passwordReducer from "./store/reducer/passwordChange";

export default function App() {
  const rootReducer = combineReducers({
    topStocks: topStocksReducer,
    login: loginReducer,
    marketsummary: marketsummaryReducer,
    loadingclients: loadingclientsReducer,
    dropdownsecurities: dropdownSecuritiesReducer,
    auth: authReducer,
    passwordChange: passwordReducer,
  });

  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  const HomeScreen = () => (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text category="h1">HOME</Text>
    </Layout>
  );

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <Provider store={store}>
          <AtradNavigator />
        </Provider>
      </ApplicationProvider>
    </>
  );
}
