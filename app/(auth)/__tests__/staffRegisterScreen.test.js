jest.useFakeTimers();
import "expo-router";
import { cleanup, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { renderWithProviders } from "../../../utils/test-utils";
import createMockStore from "../../../utils/test-utils";
import { useRouter } from "expo-router";
import { setUserType } from "../../../redux/store"; // Import the setUserType function

/* Component imports */
import StaffRegister from "../StaffRegister";

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

describe("Staff register screen", () => {
  const initialState = {
    userEmail: "",
  };
  const store = createMockStore(initialState);

  afterEach(() => {
    cleanup();
  });

  it("Should render register screen with default values", () => {
    const { getByTestId, getByText } = renderWithProviders(
      <StaffRegister />,
      store
    );
    const title = getByText("Register as staff");
    const email = getByTestId("emailInput");
    const password = getByTestId("passwordInput");
    const secPassword = getByTestId("secondaryPasswordInput");
    const code = getByTestId("codeInput");
    const button = getByTestId("submitRegister");

    expect(title).toBeTruthy();
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
    expect(secPassword).toBeTruthy();
    expect(button).toBeTruthy();
    expect(code).toBeTruthy();
  });

  it("Should show error message when email is empty", async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <StaffRegister />,
      store
    );
    const register = getByTestId("submitRegister");

    await waitFor(() => {
      fireEvent.press(register);
    });

    const errorMessage = getByText("Email cannot be empty!");
    expect(errorMessage).toBeTruthy();
  });

  it("Should show error message when password is empty", async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <StaffRegister />,
      store
    );
    const register = getByTestId("submitRegister");
    const emailInput = getByTestId("emailInput");

    await waitFor(() => {
      fireEvent.changeText(emailInput, "test@test.com");
      fireEvent.press(register);
    });

    const errorMessage = getByText("Please input a password!");
    expect(errorMessage).toBeTruthy();
  });

  it("Should show error message when passwords do not match", async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <StaffRegister />,
      store
    );
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

  it("Should show error message when staff code is empty", async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <StaffRegister />,
      store
    );
    const register = getByTestId("submitRegister");
    const emailInput = getByTestId("emailInput");
    const password = getByTestId("passwordInput");
    const secPassword = getByTestId("secondaryPasswordInput");

    await waitFor(() => {
      fireEvent.changeText(emailInput, "test@test.com");
      fireEvent.changeText(password, "000000");
      fireEvent.changeText(secPassword, "000000");
      fireEvent.press(register);
    });

    const errorMessage = getByText("Staff code cannot be empty!");
    expect(errorMessage).toBeTruthy();
  });

  it("Does show error message register fields are filled up", async () => {
    const { getByTestId, queryByTestId } = renderWithProviders(<StaffRegister />, store);
    const register = getByTestId("submitRegister");
    const emailInput = getByTestId("emailInput");
    const password = getByTestId("passwordInput");
    const secPassword = getByTestId("secondaryPasswordInput");
    const codeInput = getByTestId("codeInput")

    fireEvent.changeText(emailInput, "test@gmail.com");
    fireEvent.changeText(password, "000000");
    fireEvent.changeText(secPassword, "000000");
    fireEvent.changeText(codeInput, "0000");
    
    await waitFor(async () => {
      fireEvent.press(register);
    });
    const errMsg = queryByTestId("ErrMsg");
    expect(errMsg).toBeFalsy();
  });
});
