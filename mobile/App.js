import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNavigation from './src/views/navigation/BottomNavigation';
import ChatRoomScreen from './src/views/screens/ChatRoomScreen';
import LoginScreen from './src/views/screens/LoginScreen';
import Signup from './src/views/screens/Signup';
import {useSelector} from 'react-redux';
import colors from './src/const/colors';
const Stack = createNativeStackNavigator();

const App = () => {
  const user = useSelector(state => state.user);
  return (
    <NavigationContainer theme={{dark:true,colors:{
      background: '#fff',
      card: '#fff',
      border: colors.special1,
    }}}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={BottomNavigation} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={Signup} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({});

export default App;
