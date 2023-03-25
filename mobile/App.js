import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomNavigation from './src/views/navigation/BottomNavigation';
import ChatRoomScreen from './src/views/screens/ChatRoomScreen';
import LoginScreen from './src/views/screens/LoginScreen';
import Signup from './src/views/screens/Signup';
import {useSelector} from 'react-redux';
import colors from './src/const/colors';
import {useEffect} from 'react';
import socket from './src/socket';
import {
  getLastMessage,
  storeMessage,
} from './src/realm/controllers/MessageController';
import RNFetchBlob from 'rn-fetch-blob';
const Stack = createNativeStackNavigator();

const App = () => {
  const user = useSelector(state => state.user);
  const storeImage = newMessage => {
    let date;
    if (typeof newMessage.sendAt === 'string') {
      date = new Date(newMessage.sendAt);
    } else {
      date = newMessage.sendAt;
    }

    const files = RNFetchBlob.fs.dirs.SDCardApplicationDir + '/files';
    const filePath = `${files}/file-${date.getFullYear()}${
      date.getMonth() < 10 ? '0' : ''
    }${date.getMonth() + 1}${date.getDate() < 10 ? '0' : ''}${date.getDate()}-${
      date.getHours() < 10 ? '0' : ''
    }${date.getHours()}${
      date.getMinutes() < 10 ? '0' : ''
    }${date.getMinutes()}${
      date.getSeconds() < 10 ? '0' : ''
    }${date.getSeconds()}.${newMessage.type
      .replace('image/', '')
      .replace('video/', '')
      .replace('audio/', '')}`;
    RNFetchBlob.fs
      .createFile(filePath, newMessage.content, 'base64')
      .then(async path => {
        await storeMessage({...newMessage, content: path});
        const res = await getLastMessage(newMessage.receiver);
        socket.emit('receiveMessage', newMessage.receiver);
      });
  };
  useEffect(() => {
    if (user) {
      socket.emit('join', user.result._id, error => {
        if (error) {
          console.log(error);
        }
      });
      socket.on('message', async _message => {
        if(_message.message.sender !== user.result._id){
          if (_message.message.type == 'text') {
            await storeMessage({..._message.message,status: 'received'});
            socket.emit('receiveMessage', _message.message.receiver);
          } else {
            storeImage({..._message.message,status: 'received'});
          }
        }
      });
      return () => {
        socket.off('message');
      };
    }
  }, [user]);
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          background: '#fff',
          card: '#fff',
          border: colors.special1,
        },
      }}>
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
