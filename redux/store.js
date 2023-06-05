import { createStore } from 'redux';

// Define actions
export const setUserType = (userType) => ({
  type: 'SET_USER_TYPE',
  payload: userType,
});

// Define reducer
const initialState = {
  userType: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_TYPE':
      return {
        ...state,
        userType: action.payload,
      };
    default:
      return state;
  }
};

// Create store
const store = createStore(reducer);

export default store;
