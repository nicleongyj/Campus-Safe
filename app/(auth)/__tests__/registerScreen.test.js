jest.useFakeTimers();
// import "expo-router";
import { cleanup, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { renderWithProviders } from "../../../utils/test-utils";
import createMockStore from "../../../utils/test-utils";
import { useRouter } from "expo-router";
import { setUserType } from "../../../redux/store"; // Import the setUserType function

/* Component imports */
import Register from "../Register";

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

// Mock the `expo-router` library
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

describe("Register screen", () => {
  const initialState = {
    userEmail: "",
  };
  const store = createMockStore(initialState);

  afterEach(() => {
    cleanup();
  });

  it("Should render register screen with default values", () => {
    const { getByTestId, getByText } = renderWithProviders(<Register />, store);
    const title = getByText("Register your account")
    const email = getByTestId("emailInput");
    const password = getByTestId("passwordInput");
    const secPassword = getByTestId("secondaryPasswordInput");
    const button = getByTestId("submitRegister");

    expect(title).toBeTruthy();
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
    expect(secPassword).toBeTruthy();
    expect(button).toBeTruthy();
  });

    it("Should show error message when email is empty", async () => {
    const { getByText, getByTestId } = renderWithProviders(<Register />, store);
    const register = getByTestId("submitRegister");

    await waitFor(() => {
      fireEvent.press(register);
    });

    const errorMessage = getByText("Please fill up email");
    expect(errorMessage).toBeTruthy();
  });

  it("Should show error message when password is empty", async () => {
    const { getByText, getByTestId } =
      renderWithProviders(<Register />, store);
    const register = getByTestId("submitRegister");
    const emailInput = getByTestId("emailInput");

    await waitFor(() => {
      fireEvent.changeText(emailInput, "test@test.com");
      fireEvent.press(register);
    });

    const errorMessage = getByText("Please fill up password");
    expect(errorMessage).toBeTruthy();
  });

  it("Should show error message when passwords do not match", async () => {
    const { getByText, getByTestId } =
      renderWithProviders(<Register />, store);
    const register = getByTestId("submitRegister");
    const emailInput = getByTestId("emailInput");
    const password = getByTestId("passwordInput");
    const secPassword = getByTestId("secondaryPasswordInput");

    await waitFor(() => {
      fireEvent.changeText(emailInput, "test@test.com");
      fireEvent.changeText(password, "000000");
      fireEvent.changeText(secPassword, "111111");
      fireEvent.press(register);
    });

    const errorMessage = getByText("Passwords do not match");
    expect(errorMessage).toBeTruthy();
  });
});
