import { createStackNavigator } from '@react-navigation/stack';

import IndexScreen from '../(home)/index';
import LoginPage from '../(auth)/login';  
import StaffLogin from '../(auth)/Stafflogin';
import RegisterPage from '../(auth)/register';
import Profile from '../(home)/profile';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="StaffLogin" component={StaffLogin} />
      <Stack.Screen name="UserHome" component={IndexScreen} />
      <Stack.Screen name="RegisterPage"component={RegisterPage} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}
