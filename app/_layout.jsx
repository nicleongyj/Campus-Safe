import { Slot } from "expo-router";
import { AuthenticateProvider } from "../contexts/auth";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ToastProvider } from 'react-native-toast-notifications';
import { PushNotification } from "../lib/PushNotifications";

export default function Root() {
  PushNotification();
  return (
    <ToastProvider>
      <Provider store={store}>
        <AuthenticateProvider>
          <Slot />
        </AuthenticateProvider>
      </Provider>
    </ToastProvider>
  );
}
