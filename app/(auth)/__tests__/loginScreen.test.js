jest.useFakeTimers();
import { act, cleanup, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { renderWithProviders } from "../../../utils/test-utils";
import createMockStore from "../../../utils/test-utils";
import Login from "../Login";

const mockedNavigate = jest.fn();
const mockedShow = jest.fn();

jest.mock("expo-router", () => ({
}));

jest.mock("../../../contexts/auth", () => {
  return {
    __esModule: true,
    useAuth: () => ({ user: null }), // mock useAuth to return the desired user state
    AuthenticateProvider: ({ children }) => <>{children}</>, // mock AuthenticateProvider
  };
});

jest.mock("react-native-toast-notifications", () => ({
  useToast: () => ({
    show: mockedShow
  }),
}));

jest.mock("../../../lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(() => "error"),
    },
  },
  getUserRole: jest.fn(() => "staff"), // Replace 'user' with the role you want to test
}));


describe("Login screen", () => {
  const initialState = {
    userEmail: "",
  };
  const store = createMockStore(initialState);

  beforeEach(() => {
    mockedNavigate.mockClear();
    jest
      .spyOn(require("@react-navigation/native"), "useNavigation")
      .mockReturnValue({
        navigate: mockedNavigate,
      });
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

  it("Does show error message login fields are filled up", async () => {
    const { getByPlaceholderText, getByTestId, queryByTestId } = renderWithProviders(<Login />, store);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const signInButton = getByTestId("signInButton");

    fireEvent.changeText(emailInput, "test@gmail.com");
    fireEvent.changeText(passwordInput, "000000");
    
    await waitFor(async () => {
      fireEvent.press(signInButton);
    });
    const errMsg = queryByTestId("ErrMsg");
    expect(errMsg).toBeFalsy();
  });
});
