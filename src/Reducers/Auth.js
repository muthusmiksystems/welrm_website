import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  //   REGISTER_FAIL,
  //   REGISTER_SUCCESS,
  INIT_STATE,
} from "../Actions/types";

const initialState = {
  isAuthenticated: null,
  loading: true,
  login_error: null,
  signup_msg: null,
  user: null,
};

const Auth = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        login_error: null,
        user: payload,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload?.accesstoken);
      localStorage.setItem("user", JSON.stringify(payload?.user));

      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
        login_error: null,
      };
    // case REGISTER_FAIL:
    //   return {
    //     ...state,
    //     signup_msg: payload.error,
    //     loading: false,
    //   };t
    // case REGISTER_SUCCESS:
    //   return {
    //     ...state,
    //     signup_msg: payload.message,
    //     loading: false,
    //   };
    case LOGIN_FAIL:
      return {
        ...state,
        login_error: payload?.error,
        isAuthenticated: false,
        loading: false,
      };
    case LOGOUT:
      localStorage.removeItem("jenesis-admin-token");
      localStorage.clear()
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false, 
      };
    case AUTH_ERROR:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case INIT_STATE:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default Auth;
