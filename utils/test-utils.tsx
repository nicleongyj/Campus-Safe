import { render } from "@testing-library/react-native";
import React from "react";
import { Provider } from "react-redux";
import { AuthenticateProvider } from "../contexts/auth";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import StaffRegister from "../app/(auth)/StaffRegister";
import Register from "../app/(auth)/Register";

const Stack = createStackNavigator();
const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

export function renderWithProviders(ui: React.ReactElement, store?: any) {
  return render(
      <Provider store={store}>
        <AuthenticateProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Base">{() => ui}</Stack.Screen>
              <Stack.Screen name="Register" component={Register}></Stack.Screen>
              <Stack.Screen name="StaffRegister" component={StaffRegister}></Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </AuthenticateProvider>
      </Provider>
  );
}

export default createMockStore;
