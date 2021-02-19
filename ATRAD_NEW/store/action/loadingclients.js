import Links from "../../Links/Links";
import Portfolio from "../../Links/Portfolio";
import { Alert } from "react-native";
import * as authActions from "../action/auth";

export const SET_CLIENTS = "SET_CLIENTS";
export const GET_CLIENT_DETAILS = "GET_CLIENT_DETAILS";

export const fetchClients = () => {
  return async (dispatch) => {
    const response = await fetch(Links.mLink + Portfolio.getUserDetailsLink);

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

    const allClients = object.data.userids;

    dispatch({
      type: SET_CLIENTS,
      clients: allClients,
    });
  };
};
