import { Slot } from "expo-router";
import { AuthenticateProvider } from "../contexts/auth";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ToastProvider } from 'react-native-toast-notifications';


export default function Root() {

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
