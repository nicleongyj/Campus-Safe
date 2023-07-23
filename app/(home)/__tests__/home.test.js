jest.useFakeTimers();
import "expo-router";

import { cleanup, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import createMockStore, {
  renderWithProviders,
} from "../../../utils/test-utils";
import { useLocalSearchParams } from "expo-router";
import { setUserType } from "../../../redux/store"; // Import the setUserType function

/* Component imports */
import Index from "../Index";

jest.mock("../../../contexts/auth", () => {
  return {
    __esModule: true,
    useAuth: () => ({ user: null }), // mock useAuth to return the desired user state
    AuthenticateProvider: ({ children }) => <>{children}</>, // mock AuthenticateProvider
  };
});

const mockedNavigate = jest.fn();
const mockedShow = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock("../../../lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  },
  getUserRole: jest.fn(() => "staff"),
}));

jest.mock("react-native-toast-notifications", () => ({
  useToast: () => ({
    show: mockedShow
  }),
}));

describe("Home screen", () => {
  const initialState = {
    userEmail: "",
  };
  const store = createMockStore(initialState);

  beforeEach(() => {
    mockedShow.mockClear();
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
    mockUseLocalSearchParams.mockReturnValue({ newRegister: "false" });
    useLocalSearchParams.mockImplementation(mockUseLocalSearchParams);

    const { getByTestId, getByText } = renderWithProviders(<Index />, store);

    const title = getByText("Welcome!");
    const incidentFormButton = getByTestId("incidentButton");
    const infraFormButton = getByTestId("infraButton");
    const mapButton = getByTestId("mapButton");
    const eventMapButton = getByTestId("eventMapButton");
    const trackButton = getByTestId("trackButton");

    expect(title).toBeTruthy();
    expect(incidentFormButton).toBeTruthy();
    expect(infraFormButton).toBeTruthy();
    expect(mapButton).toBeTruthy();
    expect(eventMapButton).toBeTruthy();
    expect(trackButton).toBeTruthy();
  });

  it("Should show account registered notification if user is a new sign up", () => {
    mockUseLocalSearchParams.mockReturnValue({ newRegister: "true" });
    useLocalSearchParams.mockImplementation(mockUseLocalSearchParams);

    const home = renderWithProviders(<Index />, store);

    expect(mockedShow).toHaveBeenCalledTimes(1);
    expect(mockedShow).toHaveBeenCalledWith("Account Registered");
  });

  it("Should navigate to incident reporting form when incident button is pressed", () => {
    mockUseLocalSearchParams.mockReturnValue({ newRegister: "false" });
    useLocalSearchParams.mockImplementation(mockUseLocalSearchParams);


    const { getByTestId } = renderWithProviders(<Index />, store);
    const incidentButton = getByTestId("incidentButton");

    fireEvent.press(incidentButton);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("IncidentForm");
  });

  it("Should navigate to infrastructure reporting form when infrastructure button is pressed", () => {
    mockUseLocalSearchParams.mockReturnValue({ newRegister: "false" });
    useLocalSearchParams.mockImplementation(mockUseLocalSearchParams);


    const { getByTestId } = renderWithProviders(<Index />, store);
    const infraButton = getByTestId("infraButton");

    fireEvent.press(infraButton);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("InfrastructureForm");
  });

  it("Should navigate to map when map button is pressed", () => {
    mockUseLocalSearchParams.mockReturnValue({ newRegister: "false" });
    useLocalSearchParams.mockImplementation(mockUseLocalSearchParams);


    const { getByTestId } = renderWithProviders(<Index />, store);
    const mapButton = getByTestId("mapButton");

    fireEvent.press(mapButton);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("Map");
  });

  it("Should navigate to event map when event map button is pressed", () => {
    mockUseLocalSearchParams.mockReturnValue({ newRegister: "false" });
    useLocalSearchParams.mockImplementation(mockUseLocalSearchParams);


    const { getByTestId } = renderWithProviders(<Index />, store);
    const eventMapButton = getByTestId("eventMapButton");

    fireEvent.press(eventMapButton);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("EventMap");
  });

  it("Should navigate to tracking reports page when track reports button is pressed", () => {
    mockUseLocalSearchParams.mockReturnValue({ newRegister: "false" });
    useLocalSearchParams.mockImplementation(mockUseLocalSearchParams);


    const { getByTestId } = renderWithProviders(<Index />, store);
    const trackButton = getByTestId("trackButton");

    fireEvent.press(trackButton);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("TrackReports");
  });
});
