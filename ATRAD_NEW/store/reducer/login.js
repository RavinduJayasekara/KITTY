import { LOGIN } from "../action/login";

const initialState = {
  watchId: "",
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { watchId: action.watchID };
  }
  return state;
};

export default loginReducer;
