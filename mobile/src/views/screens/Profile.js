import {Icon} from '@rneui/base';
import {Image} from '@rneui/themed';
import {useCallback, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../const/colors';
import {updateUser} from '../../store/actions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.result);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    profile: user.profile,
  });
  const [loading, setLoading] = useState();

  const handleDocumentSelection = useCallback(async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
    });

    setLoading(true);
    const {uri, type} = response.assets[0];
    const imageData = await RNFetchBlob.fs.readFile(uri, 'base64');
    const file = `data:${type};base64,${imageData}`;
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'wafkbnld');
    data.append('cloud_name', 'dfwmkpyfy');
    fetch('https://api.cloudinary.com/v1_1/dfwmkpyfy/upload', {
      method: 'post',
      body: data,
    })
      .then(res => res.json())
      .then(data => {
        setForm(prev => {
          return {
            ...prev,
            profile: data.secure_url,
          };
        });
      })
      .finally(() => {
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {}, [user.profile]);
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
          <Image
           PlaceholderContent={<ActivityIndicator />}
            style={styles.image}
            source={{uri: form.profile}}
          />
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
        {loading ? (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#fff',
              opacity: 0.8,
              zIndex: 2,
              justifyContent: 'center',
            }}>
            <View
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                top: '50%',
              }}>
              <Text style={{marginBottom: 8, fontSize: 16}}>
                Image Upload...
              </Text>
              <ActivityIndicator size={'large'} color="darkslateblue" />
            </View>
          </View>
        ) : null}
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
