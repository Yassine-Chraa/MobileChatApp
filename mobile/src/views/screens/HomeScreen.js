import {Image} from '@rneui/themed';
import {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../const/colors';
import {logout} from '../../store/actions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {getLastMessage} from '../../realm/controllers/MessageController';
import {useFocusEffect} from '@react-navigation/native';
import socket from '../../socket';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const friends = useSelector(state => state.user.result.friends);
  const [lastMessages, setLastMessages] = useState([]);

  const fetchLastMessage = () => {
    friends.forEach(async friend => {
      const lastMessage = await getLastMessage(friend._id);
      setLastMessages(prev => {
        return [...prev, lastMessage];
      });
    });
  };

  useFocusEffect(
    useCallback(() => {
      setLastMessages([]);
      fetchLastMessage();
    }, [friends]),
  );
  useEffect(() => {
    socket.on('message', _message => {
      setLastMessages([]);
      fetchLastMessage();
    });
  },[]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{...styles.header, ...styles.marginConfig}}>
        <Text style={{color: '#000', fontSize: 30, fontWeight: 'bold'}}>
          Chats
        </Text>
        <TouchableOpacity
          activeOpacity={0.4}
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => dispatch(logout())}>
          <Icon name="logout" size={24} color={'#000'} />
        </TouchableOpacity>
      </View>
      <View style={styles.marginConfig}>
        <TextInput style={styles.input} placeholder="Search" />
        <TouchableOpacity style={{position: 'absolute', top: 16, left: 12}}>
          <Icon name="search" size={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        scrollEnabled
        showsVerticalScrollIndicator={false}
        style={{...styles.main, ...styles.marginConfig}}
        data={friends}
        renderItem={({item, index}) => {
          const now = new Date();
          const date = lastMessages[index]?.sendAt;
          let time;
          if (!date) time = '';
          else {
            if (date?.getDate() === now.getDate()) {
              time = `${date?.getHours() < 10 ? '0' : ''}${date?.getHours()}:${
                date?.getMinutes() < 10 ? '0' : ''
              }${date?.getMinutes()}`;
            } else {
              if (now.getDate() - date?.getDate() === 1) {
                time = 'Yesterday';
              } else {
                time = `${date?.getDate() < 10 ? '0' : ''}${date?.getDate()}/${
                  date?.getMonth() < 10 ? '0' : ''
                }${date?.getMonth() + 1}/${date?.getFullYear()}`;
              }
            }
          }

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ChatRoom', {
                  friend: item,
                })
              }>
              <View style={styles.chatItem}>
                <Image style={styles.profil} source={{uri: item.profile}} />
                <View style={{flex: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{fontSize: 16, color: '#000', fontWeight: 'bold'}}>
                      {item.name}
                    </Text>
                    <Text>{time}</Text>
                  </View>
                  <Text style={{fontSize: 15}}>
                    {lastMessages[index]?.type === 'text'
                      ? lastMessages[index]?.content
                      : 'media'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item._id}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  marginConfig: {
    marginTop: 12,
    marginHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerProfil: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginLeft: 8,
  },
  main: {
    marginTop: 48,
    marginBottom: 48,
    marginTop: 16,
    marginHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  profil: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  input: {
    backgroundColor: colors.special2,
    borderRadius: 18,
    paddingLeft: 40,
    paddingRight: 12,
  },
});

export default HomeScreen;
