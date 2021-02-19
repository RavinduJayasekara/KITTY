import { GET_ALL_SECURITIES } from "../action/dropdownsecurities";

const initialState = {
  securityDetails: [],
};

const dropdownSecuritiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SECURITIES:
      return {
        securityDetails: action.allSecurities,
      };
  }
  return state;
};

export default dropdownSecuritiesReducer;
