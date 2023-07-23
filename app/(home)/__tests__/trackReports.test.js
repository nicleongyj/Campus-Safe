jest.useFakeTimers();
import "expo-router";

import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import createMockStore, {
  renderWithProviders,
} from "../../../utils/test-utils";
import { Camera } from "expo-camera";

/* Component imports */
import Map from "../Map";

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
  viewMarkers: async (type) => {
    if (type === "verifiedincidents") {
      return [
        {
          id: 1,
          latitude: 37.78825,
          longitude: -122.4324,
          type: "Fire",
          details: "Fire incident",
          image_url: "url1",
        },
        {
          id: 2,
          latitude: 37.78925,
          longitude: -122.4324,
          type: "Motor accident",
          details: "Car crash",
          image_url: "url2",
        },
      ];
    } else if (type === "verifiedinfras") {
      return [
        {
          id: 3,
          latitude: 37.78925,
          longitude: -122.4324,
          type: "Construction",
          details: "Building construction",
          image_url: "url3",
        },
        {
          id: 4,
          latitude: 37.78825,
          longitude: -122.4324,
          type: "Maintenance",
          details: "Infrastructure maintenance",
          image_url: "url4",
        },
      ];
    }
    return [];
  },
}));

const mockedNavigate = jest.fn();

describe("Map screen", () => {
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

  it("Should render default values", async () => {
    await waitFor(() => {
      const { getByTestId, findAllByTestId } = renderWithProviders(
        <Map />,
        store
      );

      const switchSelector = getByTestId("switchSelector");
      const map = getByTestId("map");
      const scrollView = getByTestId("incidentScrollView");
      expect(switchSelector).toBeTruthy();
      expect(map).toBeTruthy();
      expect(scrollView).toBeTruthy();
    });
  });

  it("Should render 2 incident markers and 2 cards when there is 2 incident reports", async () => {
    await waitFor(async () => {
      const { getByTestId, findAllByTestId } = renderWithProviders(
        <Map />,
        store
      );
      const markers = await waitFor(() => findAllByTestId("incidentMarker"));
      const cards = await waitFor(() => findAllByTestId("incidentCard"));
      expect(markers).toHaveLength(2);
      expect(cards).toHaveLength(2);
    });
  });

});
