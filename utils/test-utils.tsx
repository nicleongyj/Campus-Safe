import { Portal, PortalProvider } from "@gorhom/portal";
import { render } from "@testing-library/react-native";
// import { Stack } from "expo-router";
import React from "react";
import { Provider } from "react-redux";
// import { realStore } from "../redux/store";
import { AuthenticateProvider } from "../contexts/auth";
import renderer from "react-test-renderer";
import { ToastProvider } from "react-native-toast-notifications";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import StaffRegister from "../app/(auth)/StaffRegister";
import Register from "../app/(auth)/Register";

const Stack = createStackNavigator();

/*
This is a wrapper for provider for jest
*/

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

export function renderWithProviders(ui: React.ReactElement, store?: any) {
  return render(
    // <ToastProvider>
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
    // </ToastProvider>
  );
}

export default createMockStore;
