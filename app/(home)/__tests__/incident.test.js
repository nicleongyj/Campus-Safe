jest.useFakeTimers();
import "expo-router";

import {
  act,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import createMockStore, { renderWithProviders } from "../../../utils/test-utils";
import { Camera } from "expo-camera"; 

/* Component imports */
import Index from "../Index";
import IncidentForm from "../IncidentForm";

jest.mock("../../../contexts/auth", () => {
  return {
    __esModule: true,
    useAuth: () => ({ user: null }), 
    AuthenticateProvider: ({ children }) => <>{children}</>, 
  };
});

jest.mock("react-native-keyboard-aware-scroll-view", () => {
  return {
    KeyboardAwareScrollView: jest
      .fn()
      .mockImplementation(({ children }) => children),
  };
});

jest.mock("../../../lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  },
  getUserRole: jest.fn(() => "staff"),
  insertReportData: jest.fn(),
  insertImage: jest.fn(),
  getImageURL: jest.fn(),
}));

const mockedNavigate = jest.fn();

describe("Incident form screen", () => {
  const initialState = {
    userEmail: "",
  };
  const store = createMockStore(initialState);

  beforeEach(() => {
    mockedNavigate.mockClear();
    jest
      .spyOn(Camera, "useCameraPermissions")
      .mockReturnValue([true, jest.fn()]);

    jest
      .spyOn(require("@react-navigation/native"), "useNavigation")
      .mockReturnValue({
        navigate: mockedNavigate,
      });
  });

  afterEach(() => {
    cleanup();
  });

  it("Should tell user to enable camera permission if camera permission is disabled", async () => {
    jest
      .spyOn(Camera, "useCameraPermissions")
      .mockReturnValue([false, jest.fn()]);
    const { getByText } = renderWithProviders(<IncidentForm />, store);
    const title = getByText("No access to camera");
    const subTitle = getByText(
      "Allow Expo to access your camera in your settings"
    );
    expect(title).toBeTruthy();
    expect(subTitle).toBeTruthy();
  });

  it("Should render default values", () => {
    const { getByTestId } = renderWithProviders(<IncidentForm />, store);
    const backButton = getByTestId("backButton");
    const incidentPicker = getByTestId("incidentPicker");
    const othersInput = getByTestId("othersInput");
    const urgencyPicker = getByTestId("urgencyPicker");
    const locationInput = getByTestId("locationInput");
    const detailsInput = getByTestId("detailsInput");
    const cameraButton = getByTestId("cameraButton");
    const submitButton = getByTestId("submitButton");

    expect(backButton).toBeTruthy();
    expect(incidentPicker).toBeTruthy();
    expect(othersInput).toBeTruthy();
    expect(urgencyPicker).toBeTruthy();
    expect(locationInput).toBeTruthy();
    expect(detailsInput).toBeTruthy();
    expect(cameraButton).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it("Should navigate to home screen when back button is pressed", () => {
    const { getByTestId } = renderWithProviders(<IncidentForm />, store);
    const backButton = getByTestId("backButton");
    fireEvent.press(backButton);

    expect(mockedNavigate).toHaveBeenCalledTimes(1);
    expect(mockedNavigate).toHaveBeenCalledWith("index");
  });

  it("Should show error message when incident input is empty", () => {
    const { getByTestId, getByText } = renderWithProviders(
      <IncidentForm />,
      store
    );

    const submitButton = getByTestId("submitButton");

    fireEvent.press(submitButton);

    const errorMessage = getByText("Fill up incident type!");
    expect(errorMessage).toBeTruthy();
  });

  it("Should show error message when others input is empty when incident type is 'Others'", () => {
    const { getByTestId, getByText } = renderWithProviders(
      <IncidentForm />,
      store
    );

    const submitButton = getByTestId("submitButton");
    const dropDownPicker = getByTestId("incidentPicker");

    fireEvent.press(dropDownPicker);
    const othersOption = getByTestId("Others");
    fireEvent.press(othersOption);
    fireEvent.press(submitButton);

    const errorMessage = getByText("Fill up incident details!");
    expect(errorMessage).toBeTruthy();
  });

  it("Should show error message when urgency level input is empty", () => {
    const { getByTestId, getByText } = renderWithProviders(
      <IncidentForm />,
      store
    );

    const submitButton = getByTestId("submitButton");
    const dropDownPicker = getByTestId("incidentPicker");
    fireEvent.press(dropDownPicker);

    const fireOption = getByTestId("Fire");
    fireEvent.press(fireOption);
    fireEvent.press(submitButton);

    const errorMessage = getByText("Fill up level of emergency!");
    expect(errorMessage).toBeTruthy();
  });

  it("Should show error message when location input is empty", () => {
    const { getByTestId, getByText } = renderWithProviders(
      <IncidentForm />,
      store
    );

    const submitButton = getByTestId("submitButton");
    const incidentPicker = getByTestId("incidentPicker");
    const urgencyPicker = getByTestId("urgencyPicker");

    fireEvent.press(incidentPicker);
    const fireOption = getByTestId("Fire");
    fireEvent.press(fireOption);
    fireEvent.press(urgencyPicker);
    const urgency1 = getByTestId("urgency1");
    fireEvent.press(urgency1);
    fireEvent.press(submitButton);

    const errorMessage = getByText("Fill up location!");
    expect(errorMessage).toBeTruthy();
  });

  it("Should not show any error when all inputs are filled", async () => {
    const { getByTestId, queryByTestId } = renderWithProviders(
      <IncidentForm />,
      store
    );
    const alertSpy = jest.spyOn(Alert, 'alert');
    const incidentPicker = getByTestId("incidentPicker");
    const urgencyPicker = getByTestId("urgencyPicker");
    const cameraButton = getByTestId("cameraButton");
    const locationInput = getByTestId("locationInput");

    //fill up incident
    fireEvent.press(incidentPicker);
    const fireOption = getByTestId("Fire");
    fireEvent.press(fireOption);
    //fill up urgency
    fireEvent.press(urgencyPicker);
    const urgency1 = getByTestId("urgency1");
    fireEvent.press(urgency1);
    //fill up location
    fireEvent.changeText(locationInput, "NUS");
    //take picture
    fireEvent.press(cameraButton);
    const shutterButton = getByTestId("shutterButton");
    await waitFor(() => fireEvent.press(shutterButton));
    const useImageButton = getByTestId("useImageButton");
    fireEvent.press(useImageButton);

    //submit
    const submitButton = getByTestId("submitButton");
    await act(async () => {
      fireEvent.press(submitButton);
    });
    const errMsg = queryByTestId("errMsg");
    expect(errMsg).toBeFalsy();
    expect(alertSpy).toHaveBeenCalledWith(
      'Your report has been received!',
      "View the status of your report in 'View your reports'",
      [{ text: 'OK', onPress: expect.any(Function) }]
    );
  });
});
