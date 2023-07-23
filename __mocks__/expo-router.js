export const useRouter = jest.fn().mockReturnValue({});
export const useSegments = jest.fn().mockReturnValue({});
export const useLocalSearchParams = jest.fn();
export const createStackNavigator = jest
  .fn()
  .mockReturnValue(({ children }) => <>{children}</>);
