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
import EventMap from "../eventMap";

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
      return [
        {
          id: 1,
          latitude: 37.78825,
          longitude: -122.4324,
          type: "NUS open house",
          details: "Computing open house",
          image_url: "url1",
        },
        {
          id: 2,
          latitude: 37.78925,
          longitude: -122.4324,
          type: "NUS homecoming",
          details: "Join us",
          image_url: "url2",
        },
      ];
  },
}));

const mockedNavigate = jest.fn();

describe("Event map screen", () => {
  const initialState = {
    userEmail: "",
  };
  const store = createMockStore(initialState);

  afterEach(() => {
    cleanup();
  });

  it("Should render default values", async () => {
    await waitFor(() => {
      const { getByTestId } = renderWithProviders(
        <EventMap />,
        store
      );
      const map = getByTestId("map");
      const scrollView = getByTestId("scrollView");
      expect(map).toBeTruthy();
      expect(scrollView).toBeTruthy();
    });
  });

  it("Should render 2 markers and 2 cards when there is 2 events", async () => {
    await waitFor(async () => {
      const { findAllByTestId } = renderWithProviders(
        <EventMap />,
        store
      );
      const markers = await waitFor(() => findAllByTestId("eventMarker"));
      const cards = await waitFor(() => findAllByTestId("eventCard"));
      expect(markers).toHaveLength(2);
      expect(cards).toHaveLength(2);
    });
  });

});
