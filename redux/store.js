import { createStore } from "redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'

// Define actions
export const setUserType = (userType) => ({
  type: "SET_USER_TYPE",
  payload: userType,
});

export const setUserEmail = (userEmail) => ({
  type: "SET_USER_EMAIL",
  payload: userEmail,
});

export const setUserPassword = (userPassword) => ({
  type: "SET_USER_PASSWORD",
  payload: userPassword,
});

// Define reducer
const initialState = {
  userType: "",
  userEmail: "",
  userPassword: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_TYPE":
      return {
        ...state,
        userType: action.payload,
      };
    case "SET_USER_EMAIL":
      return {
        ...state,
        userEmail: action.payload,
      };
    case "SET_USER_PASSWORD":
      return {
        ...state,
        userPassword: action.payload,
      };
    default:
      return state;
  }
};

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
// }
// const persistedReducer = persistReducer(persistConfig, reducer)
// export const store = createStore(persistedReducer)
// export const persistor = persistStore(store)

export const store = createStore(reducer);

export default store;