import {useCallback, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  FlatList,
} from 'react-native';
import {Icon} from '@rneui/base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../const/colors';
import {useSelector} from 'react-redux';
import {
  deleteAll,
  getRoomMessages,
  storeMessage,
} from '../../realm/controllers/MessageController';
import socket from '../../socket';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Video from 'react-native-video';

const ChatRoomScreen = ({navigation, route}) => {
  const {friend} = route.params;
  const user_id = useSelector(state => state.user.result._id);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);
  const [paused, setPaused] = useState(true);
  const fetchData = async () => {
    const roomMessages = await getRoomMessages(user_id);
    setRoomMessages(roomMessages);
  };
  const storeImage = newMessage => {
    let date;
    if (typeof newMessage.sendAt === 'string') {
      date = new Date(newMessage.sendAt);
    } else {
      date = newMessage.sendAt;
    }

    const files = RNFetchBlob.fs.dirs.SDCardApplicationDir + '/files';
    const filePath = `${files}/img-${date.getFullYear()}${
      date.getMonth() < 10 ? '0' : ''
    }${date.getMonth() + 1}${date.getDate() < 10 ? '0' : ''}${date.getDate()}-${
      date.getHours() < 10 ? '0' : ''
    }${date.getHours()}:${
      date.getMinutes() < 10 ? '0' : ''
    }${date.getMinutes()}${
      date.getSeconds() < 10 ? '0' : ''
    }${date.getSeconds()}.${newMessage.type.replace('image/', '')}`.replace(
      'video/',
      '',
    );
    RNFetchBlob.fs
      .createFile(filePath, newMessage.content, 'base64')
      .then(async path => {
        console.log(path);
        await storeMessage({...newMessage, content: path});
        fetchData();
      });
  };
  const sendMessage = async () => {
    if (image != '') {
      const imageData = await RNFetchBlob.fs.readFile(image.uri, 'base64');
      const newMessage = {
        sender: user_id,
        receiver: friend._id,
        content: imageData,
        type: image.type,
        sendAt: new Date(),
      };
      socket.emit('sendMessage', newMessage, () => {
        setImage('');
        storeImage(newMessage);
      });
    } else {
      if (message != '') {
        const newMessage = {
          sender: user_id,
          receiver: friend._id,
          content: message,
          type: 'text',
          sendAt: new Date(),
        };
        socket.emit('sendMessage', newMessage, () => {
          setMessage('');
          storeMessage(newMessage);
        });
      }
    }
  };
  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      setImage(response[0]);
    } catch (err) {
      console.warn(err);
    }
  }, []);
  useEffect(() => {
    fetchData();
    socket.emit('join', user_id, error => {
      if (error) {
        console.log(error);
      }
    });
    return () => {
      socket.on('disconnect');
      socket.off();
    };
  }, [user_id, friend._id]);
  useEffect(() => {
    socket.on('message', _message => {
      if (_message.message.type == 'text') {
        storeMessage(_message.message);
        fetchData();
      } else {
        storeImage(_message.message);
      }
    });
  }, []);
  console.log(friend);
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon type="material" name="arrow-back" size={24} color={'#fff'} />
          </TouchableOpacity>
          <Image style={styles.profil} source={{uri: friend.profile}} />
          <TouchableOpacity>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '600',
              }}>
              {friend.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ImageBackground
        source={require('../../assets/images/chat_bg1.png')}
        resizeMode="cover"
        style={{flex: 1}}>
        <FlatList
          style={{marginBottom: 24}}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          inverted
          data={roomMessages}
          renderItem={({item}) => {
            const date = item?.sendAt;
            const time = `${
              date?.getHours() < 10 ? '0' : ''
            }${date?.getHours()}:${
              date?.getMinutes() < 10 ? '0' : ''
            }${date?.getMinutes()}`;
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:
                    item.sender === user_id ? 'flex-end' : 'flex-start',
                  paddingTop: 8,
                  paddingHorizontal: 6,
                }}>
                <View style={styles.message}>
                  {item.type === 'text' ? (
                    <View style={{paddingHorizontal: 8}}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#000',
                          marginBottom: -4,
                        }}>
                        {item.content}
                      </Text>
                      <Text style={{fontSize: 12, marginLeft: 32}}>{time}</Text>
                    </View>
                  ) : (
                    <>
                      {item.type.includes('video/') ? (
                        <>
                          <Video
                            paused={paused}
                            poster={'file:///' + item.content}
                            posterResizeMode="cover"
                            style={{width: 250, height: 300, borderRadius: 8}}
                            source={{uri: 'file:///' + item.content}}
                          />
                          {paused ? (
                            <TouchableOpacity
                              activeOpacity={0.4}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginLeft: -20,
                                marginTop: -16,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 8,
                              }}
                              onPress={() => setPaused(false)}>
                              <Icon
                                type="font-awesome"
                                name="play"
                                size={20}
                                color={'#fff'}
                              />
                            </TouchableOpacity>
                          ) : null}
                        </>
                      ) : (
                        <Image
                          style={{width: 200, height: 300, borderRadius: 8}}
                          source={{uri: 'file:///' + item.content}}
                        />
                      )}

                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 14,
                          marginLeft: 'auto',
                          position: 'absolute',
                          bottom: 6,
                          right: 6,
                        }}>
                        {time}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            );
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            bottom: 8,
            width: '100%',
            paddingHorizontal: 6,
          }}>
          <TextInput
            style={styles.input}
            placeholder="Message"
            value={message}
            onChangeText={setMessage}></TextInput>
          <View style={{position: 'absolute', top: 16, left: 16}}>
            <TouchableOpacity style={{}}>
              <Icon name="mood" size={20} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleDocumentSelection}
            activeOpacity={0.4}
            style={{paddingRight: 0, marginLeft: -30}}>
            <Icon name={'link'} size={24} color={colors.green} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.4} onPress={sendMessage}>
            <MaterialIcon
              type="material"
              name="send"
              size={20}
              color={colors.green}
              style={styles.send}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    fontSize: 18,
    paddingLeft: 40,
    paddingVertical: 10,
  },
  header: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    justifyContent: 'space-between',
  },
  profil: {
    height: 45,
    width: 45,
    borderRadius: 25,
    marginRight: 8,
    marginLeft: 4,
  },
  message: {
    padding: 2,
    borderRadius: 12,
    backgroundColor: colors.special2,
  },
  send: {
    marginLeft: 16,
    backgroundColor: colors.green,
    borderRadius: 24,
    padding: 12,
    color: '#fff',
  },
});

export default ChatRoomScreen;
