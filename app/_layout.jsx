import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/auth";
import { Provider } from "react-redux";
import store from "../redux/store";

export default function Root() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Slot />
      </Provider>
    </AuthProvider>
  );
}
