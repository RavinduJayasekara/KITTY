import Links from "../../Links/Links";
import Watch from "../../Links/Watch";
import * as authActions from "../action/auth";
import { Alert } from "react-native";

export const GET_ALL_SECURITIES = "GET_ALL_SECURITIES";

export const fetchDropDownAllSecurities = () => {
  return async (dispatch) => {
    const response = await fetch(Links.mLink + Watch.allSecurityLink);
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

    const allSecurities = object.data.items;

    dispatch({
      type: GET_ALL_SECURITIES,
      allSecurities: allSecurities,
    });
  };
};
