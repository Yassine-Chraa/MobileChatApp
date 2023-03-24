import {Icon} from '@rneui/base';
import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';
import colors from '../../const/colors';
import {updateUser} from '../../store/actions/auth';
import {useDispatch, useSelector} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {launchImageLibrary} from 'react-native-image-picker';
const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.result);
  const [image, setImage] = React.useState(user.profile);
  const [form, setForm] = React.useState({
    name: user.name,
    email: user.email,
    profile: user.profile,
  });

  const handleDocumentSelection = React.useCallback(async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
      });
      console.log(response.assets[0]);
      const imageData = await RNFetchBlob.fs.readFile(
        response.assets[0].uri,
        'base64',
      );

      const files = RNFetchBlob.fs.dirs.SDCardApplicationDir + '/files';
      const filePath = `${files}/${response.assets[0].fileName}`;
      RNFetchBlob.fs
        .createFile(filePath, imageData, 'base64')
        .then(async path => {
          setImage(path);
        });

      setForm(prev => {
        return {
          ...prev,
          profile: imageData,
        };
      });
    } catch (err) {
      console.warn(err);
    }
  }, []);

  React.useEffect(()=>{
    const date = new Date()
    const files = RNFetchBlob.fs.dirs.SDCardApplicationDir + '/files';
    const filePath = `${files}/profile-${date.getFullYear()}${
      date.getMonth() < 10 ? '0' : ''
    }${date.getMonth() + 1}${date.getDate() < 10 ? '0' : ''}${date.getDate()}-${
      date.getHours() < 10 ? '0' : ''
    }${date.getHours()}${
      date.getMinutes() < 10 ? '0' : ''
    }${date.getMinutes()}${
      date.getSeconds() < 10 ? '0' : ''
    }${date.getSeconds()}.jpg`;
    RNFetchBlob.fs
      .createFile(filePath, user.profile, 'base64')
      .then(async path => {
        setImage(path);
      });
  },[user.profile])
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={{color: '#000', fontSize: 30, fontWeight: 'bold'}}>
          Profile
        </Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(updateUser(form));
            navigation.navigate('Chats');
          }}>
          <Text style={{color: '#E21818', fontSize: 18, fontWeight: 'bold'}}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
          <Image style={styles.image} source={{uri: 'file:///'+image}} />
          <TouchableOpacity
            activeOpacity={0.4}
            style={styles.addIcon}
            onPress={handleDocumentSelection}>
            <Icon type="font-awesome" name="camera" color={'#fff'} size={16} />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 24}}>
          <TextInput
            value={form.name}
            onChangeText={v =>
              setForm(prev => {
                return {...prev, name: v};
              })
            }
            textContentType="username"
            placeholder="Full Name"
            style={styles.input}
          />
          <TextInput
            value={form.email}
            onChangeText={v =>
              setForm(prev => {
                return {...prev, email: v};
              })
            }
            keyboardType="email-address"
            textContentType="emailAddress"
            placeholder="Email"
            style={styles.input}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 12,
  },
  main: {
    marginTop: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  addIcon: {
    backgroundColor: colors.green,
    borderRadius: 20,
    padding: 6,
    position: 'absolute',
    right: 14,
    top: 3,
  },
  input: {
    backgroundColor: colors.special2,
    borderRadius: 4,
    paddingLeft: 16,
    paddingRight: 12,
    marginBottom: 24,
  },
});

export default Profile;
