import {useCallback, useEffect, useState} from 'react';
import {Image} from '@rneui/themed';
import {
  Text,
  StyleSheet,
  View,
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
  getRoomMessages,
  storeMessage,
} from '../../realm/controllers/MessageController';
import socket from '../../socket';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Message from '../../components/Message';

const ChatRoomScreen = ({navigation, route}) => {
  const {friend} = route.params;
  const user_id = useSelector(state => state.user.result._id);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);

  const [openOptions, setOpenOptions] = useState(false);
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
        console.log(path);
        await storeMessage({...newMessage, content: path});
        fetchData();
      });
  };
  const sendMessage = async () => {
    if (file != '') {
      const imageData = await RNFetchBlob.fs.readFile(file.uri, 'base64');
      const newMessage = {
        sender: user_id,
        receiver: friend._id,
        content: imageData,
        type: file.type,
        sendAt: new Date(),
      };
      socket.emit('sendMessage', newMessage, () => {
        setFile('');
        storeImage(newMessage);
        setOpenOptions(false);
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
  const handleSelection = useCallback(async type => {
    console.log(type);
    if (type === 'audio') {
      try {
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          type: DocumentPicker.types.audio,
        });
        setFile(response[0]);
      } catch (err) {
        console.warn(err);
      }
    } else {
      const result =
        type === 'camera'
          ? await launchCamera()
          : await launchImageLibrary({mediaType: type});
      setFile(result.assets[0]);
    }
  }, []);
  useEffect(() => {
    fetchData();
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
            return <Message user_id={user_id} profile={friend.profil} item={item}/>
          }}
        />
        {openOptions ? (
          <View style={styles.options}>
            <TouchableOpacity
              onPress={() => handleSelection('photo')}
              activeOpacity={0.4}
              style={{...styles.option, backgroundColor: '#B46060'}}>
              <Icon size={20} type="font-awesome" name="image" color={'#fff'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelection('video')}
              activeOpacity={0.4}
              style={{...styles.option, backgroundColor: '#B46060'}}>
              <Icon size={20} type="font-awesome" name="play-circle" color={'#fff'} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => handleSelection('audio')}
              style={{...styles.option, backgroundColor: colors.green}}>
              <Icon
                size={20}
                type="font-awesome"
                name="headphones"
                color={'#fff'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSelection('camera')}
              activeOpacity={0.4}
              style={{...styles.option, backgroundColor: '#7149C6'}}>
              <Icon
                size={20}
                type="font-awesome"
                name="camera"
                color={'#fff'}
              />
            </TouchableOpacity>
          </View>
        ) : null}
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
          <View
            style={{paddingRight: 0, marginLeft: -58, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => setOpenOptions(prev => !prev)}
              activeOpacity={0.4}>
              <Icon name={'link'} size={24} color={colors.green} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft: 4}}
              onPress={() => handleSelection('camera')}
              activeOpacity={0.4}>
              <Icon
                type="font-awesome"
                name={'camera'}
                size={20}
                color={colors.green}
              />
            </TouchableOpacity>
          </View>
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
  send: {
    marginLeft: 16,
    backgroundColor: colors.green,
    borderRadius: 24,
    padding: 12,
    color: '#fff',
  },
  options: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 16,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  option: {
    padding: 12,
    borderRadius: 40,
    marginHorizontal: 8,
  },
});

export default ChatRoomScreen;
