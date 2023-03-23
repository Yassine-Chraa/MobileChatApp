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
const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.result);
  const [form, setForm] = React.useState({
    name: user.name,
    email: user.email,
    profile: user.profile,
  });

  const handleDocumentSelection = React.useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      setForm(prev => {
        return {
          ...prev,
          profile: response[0].uri,
        };
      });
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={{color: '#000', fontSize: 30, fontWeight: 'bold'}}>
          Profile
        </Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(updateUser(form));
            navigation.navigate('Chats')
          }}>
          <Text style={{color: '#E21818', fontSize: 18, fontWeight: 'bold'}}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
          <Image style={styles.image} source={{uri: form.profile}} />
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
