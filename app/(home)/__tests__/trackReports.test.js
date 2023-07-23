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
import TrackReports from "../trackReports";

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
  viewFilteredReport: async (viewMode, filter) => {
    if (viewMode === "incidents") {
      if (filter === "unverified") {
        return [
          {
            type: "incident",
            details: "Evacuate area",
            image_url: "url3",
          },
        ];
      } else if (filter === "verified") {
        return [
          {
            type: "incident",
            details: "Evacuate area",
            image_url: "url3",
          },
          {
            type: "incident",
            details: "Evacuate area",
            image_url: "url3",
          },
        ];
      } else if (filter === "resolved") {
        return [
          {
            type: "incident",
            details: "Evacuate area",
            image_url: "url3",
          },
          {
            type: "incident",
            details: "Evacuate area",
            image_url: "url3",
          },
          {
            type: "incident",
            details: "Evacuate area",
            image_url: "url3",
          },
        ];
      } else if (filter === "rejected") {
        return [
          {
            type: "incident",
            details: "Evacuate area",
            image_url: "url3",
          },
          {
            type: "incident",
            details: "Evacuate area",
            image_url: "url3",
          },
          {
            type: "incident",
            details: "Evacuate area",
            image_url: "url3",
          },
          {
            type: "incident",
            details: "Evacuate area",
            image_url: "url3",
          },
        ];
      } else {
        return;
      }
    } else if (viewMode === "infrastructures") {
      return [
        {
          type: "Construction",
          details: "Building construction",
          image_url: "url3",
        },
      ];
    }
    return [];
  },
}));

const mockedNavigate = jest.fn();

describe("Track reports screen", () => {
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
      const { getByTestId } = renderWithProviders(<TrackReports />, store);

      const backButton = getByTestId("backButton");
      const viewSwitchSelector = getByTestId("viewSwitchSelector");
      const filterSwitchSelector = getByTestId("filterSwitchSelector");
      expect(backButton).toBeTruthy();
      expect(viewSwitchSelector).toBeTruthy();
      expect(filterSwitchSelector).toBeTruthy();
    });
  });

  it("Should render 1 card when viewing unverified incidents with mock data", async () => {
    await waitFor(async () => {
      const { findAllByTestId } = renderWithProviders(<TrackReports />, store);
      const cards = await waitFor(() => findAllByTestId("card"));
      expect(cards).toHaveLength(1);
    });
  });

  it("Should render 1 card when viewing unverified infrastructure issues with mock data", async () => {
    await waitFor(async () => {
      const { getByTestId, findAllByTestId, findByText } = renderWithProviders(
        <TrackReports />,
        store
      );
      const infrastructureButton = getByTestId("infrastructureButton");
      fireEvent.press(infrastructureButton);
      const cards = await waitFor(() => findAllByTestId("card"));
      expect(cards).toHaveLength(1);
    });
  });

  it("Should render 2 cards when viewing verified infrastructure issues with mock data", async () => {
    await waitFor(async () => {
      const { getByTestId, findAllByTestId } = renderWithProviders(
        <TrackReports />,
        store
      );
      const resolvedButton = getByTestId("verified");
      fireEvent.press(resolvedButton);
      const cards = await waitFor(() => findAllByTestId("card"));
      expect(cards).toHaveLength(2);
    });
  });
  it("Should render 3 cards when viewing verified infrastructure issues with mock data", async () => {
    await waitFor(async () => {
      const { getByTestId, findAllByTestId } = renderWithProviders(
        <TrackReports />,
        store
      );
      const resolvedButton = getByTestId("resolved");
      fireEvent.press(resolvedButton);
      const cards = await waitFor(() => findAllByTestId("card"));
      expect(cards).toHaveLength(3);
    });
  });
  it("Should render 4 cards when viewing verified infrastructure issues with mock data", async () => {
    await waitFor(async () => {
      const { getByTestId, findAllByTestId } = renderWithProviders(
        <TrackReports />,
        store
      );
      const resolvedButton = getByTestId("rejected");
      fireEvent.press(resolvedButton);
      const cards = await waitFor(() => findAllByTestId("card"));
      expect(cards).toHaveLength(4);
    });
  });
});
