jest.useFakeTimers();
import "expo-router";
import { cleanup, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { renderWithProviders } from "../../../utils/test-utils";
import createMockStore from "../../../utils/test-utils";
import { useRouter } from "expo-router";
import { setUserType } from "../../../redux/store"; // Import the setUserType function

/* Component imports */
import Login from "../Login";

jest.mock("expo-router", () => ({
  Link: ({ children, href }) => <>{children}</>,
  // useNavigation: jest.fn(),
  // useLocalSearchParams: jest.fn(),
}));

jest.mock("../../../contexts/auth", () => {
  return {
    __esModule: true,
    useAuth: () => ({ user: null }), // mock useAuth to return the desired user state
    AuthenticateProvider: ({ children }) => <>{children}</>, // mock AuthenticateProvider
  };
});

const mockedReplace = jest.fn();

const mockedNavigate = jest.fn();

// jest.mock('@react-navigation/native', () => {
//   const actualNav = jest.requireActual('@react-navigation/native');
//   return {
//     ...actualNav,
//     useNavigation: () => ({
//       navigate: mockedNavigate,
//     }),
//   };
// });

jest.mock("../../../lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  },
  getUserRole: jest.fn(() => "staff"), // Replace 'user' with the role you want to test
}));

// Mock the `expo-router` library
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

describe("Login screen", () => {
  const initialState = {
    userEmail: "",
  };
  const store = createMockStore(initialState);

  beforeEach(() => {
    // Reset the number of times the mockedNavigate function is called before each test
    mockedNavigate.mockClear();
    // Mock the useNavigation hook to return the mockedNavigate function
    jest
      .spyOn(require("@react-navigation/native"), "useNavigation")
      .mockReturnValue({
        navigate: mockedNavigate,
      });
    // jest.spyOn(require("expo-router"), "useSegments").mockReturnValue({
    //   replace: mockedReplace,
    // });
  });

  afterEach(() => {
    cleanup();
  });

  it("Should render default values", () => {
    const { getByTestId, getByText, getByPlaceholderText } =
      renderWithProviders(<Login />, store);

    const logoImage = getByTestId("logoImage");
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const signInButton = getByTestId("signInButton");
    expect(logoImage).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(signInButton).toBeTruthy();
  });


  it("Should show error message when email is empty", () => {
    const { getByText, getByTestId } = renderWithProviders(<Login />, store);
    const signInButton = getByTestId("signInButton");

    fireEvent.press(signInButton);

    const errorMessage = getByText("Email cannot be empty!");
    expect(errorMessage).toBeTruthy();
  });

  it("Should show error message when password is empty", () => {
    const { getByText, getByTestId, getByPlaceholderText } =
      renderWithProviders(<Login />, store);
    const signInButton = getByTestId("signInButton");
    const emailInput = getByPlaceholderText("Email");

    fireEvent.changeText(emailInput, "test@test.com");
    fireEvent.press(signInButton);

    const errorMessage = getByText("Please input a password!");
    expect(errorMessage).toBeTruthy();
  });

  it("Navigates to register page when register button is pressed", () => {
    const { getByTestId } = renderWithProviders(<Login />, store);

    const registerButton = getByTestId("registerButton");

    fireEvent.press(registerButton);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("Register");
  });

  it("Navigates to staff register page when register button is pressed", () => {
    const { getByTestId } = renderWithProviders(<Login />, store);

    const staffRegisterButton = getByTestId("staffRegisterButton");
    fireEvent.press(staffRegisterButton);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("StaffRegister");
  });

  // it("Navigates to home page once signed in", async () => {
  //   const { getByTestId, getByText, getByPlaceholderText } =
  //     renderWithProviders(<Login />, store);

  //   const signInButton = getByTestId("signInButton");
  //   const emailInput = getByPlaceholderText("Email");
  //   const passwordInput = getByPlaceholderText("Password");

  //   await waitFor(() => {
  //     fireEvent.changeText(emailInput, "test@gmail.com");
  //     fireEvent.changeText(passwordInput, "000000");
  //   });

  //   const { useRouter } = require('expo-router');
  //   const router = useRouter();

  //   await waitFor(() => {
  //     fireEvent.press(signInButton);
  //   });

  //   const { onAuthStateChange } = require('../../../lib/supabase').supabase.auth;
  //   onAuthStateChange.mockImplementation((handler) => handler({ event: 'SIGNED_IN' }));

  //   expect(router.replace).toHaveBeenCalledTimes(1);

  //   // const mockedOnAuthStateChange = require("../../../lib/supabase").supabase.auth.onAuthStateChange;
  //   // const user = { /* Provide the user object that represents a signed-in user */ };
  //   // // Simulate a successful sign-in event
  //   // mockedOnAuthStateChange.mockImplementation((callback) => callback("SIGNED_IN", { user }));

  //   // // Render the Login component with providers

  //   // // Assuming you have a unique header text on the home page
  //   // // You can assert that the user is navigated to the home page
  //   // const homePageHeaderText = getByText("Welcome!");
  //   // expect(homePageHeaderText).toBeTruthy();

  //   // // Now, check whether the 'router.replace' method was called with the correct arguments
  //   // const replaceSpy = useRouter().replace;
  //   // expect(replaceSpy).toHaveBeenCalledTimes(1);
  //   // expect(replaceSpy).toHaveBeenCalledWith({ pathname: "/", params: { newRegister: false } });

  // });
});
