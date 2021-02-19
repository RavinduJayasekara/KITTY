import Links from "../../Links/Links";
import TopStocks from "../../Links/TopStocks";
import { Alert } from "react-native";
import * as authActions from "../action/auth";

export const SET_GAINERS = "SET_GAINERS";
export const SET_LOSERS = "SET_LOSERS";
export const SET_TURN_OVER = "SET_TURN_OVER";
export const SET_SHARE_VOLUME = "SET_SHARE_VOLUME";

export const fetchGainers = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(Links.mLink + TopStocks.gainersLink);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      if (object.code === "1100") {
        Alert.alert("", "Your session has been invalidated!", [
          {
            text: "Okay",
            onPress: () => {
              dispatch(authActions.signOut());
            },
          },
        ]);
      }

      dispatch({
        type: SET_GAINERS,
        gainers: object.data.watch,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchLosers = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(Links.mLink + TopStocks.losersLink);

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);
      console.log(object);

      // if (object.code === "1100") {
      //   Alert.alert("", "Your session has been invalidated!", [
      //     {
      //       text: "Okay",
      //       onPress: () => {
      //         dispatch(authActions.signOut());
      //       },
      //     },
      //   ]);
      // }

      dispatch({
        type: SET_LOSERS,
        losers: object.data.watch,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const fetchShareVolume = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(Links.mLink + TopStocks.shareVolumeLink);

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      // if (object.code === "1100") {
      //   Alert.alert("", "Your session has been invalidated!", [
      //     {
      //       text: "Okay",
      //       onPress: () => {
      //         dispatch(authActions.signOut());
      //       },
      //     },
      //   ]);
      // }

      // if (object.code === "1100") {
      //   Alert.alert("", "Your session has been invalidated!", [
      //     {
      //       text: "Okay",
      //       onPress: () => {
      //         dispatch(authActions.signOut());
      //       },
      //     },
      //   ]);
      // }

      dispatch({
        type: SET_SHARE_VOLUME,
        shareVolume: object.data.watch,
      });
    } catch (err) {}
  };
};

export const fetchTurnOver = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(Links.mLink + TopStocks.turnOverLink);

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      // if (object.code === "1100") {
      //   Alert.alert("", "Your session has been invalidated!", [
      //     {
      //       text: "Okay",
      //       onPress: () => {
      //         dispatch(authActions.signOut());
      //       },
      //     },
      //   ]);
      // }

      dispatch({
        type: SET_TURN_OVER,
        turnOver: object.data.watch,
      });
    } catch (err) {
      throw err;
    }
  };
};
