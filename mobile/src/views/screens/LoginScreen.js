import {useState} from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import colors from '../../const/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {login} from '../../store/actions/auth';
import AwesomeAlert from 'react-native-awesome-alerts';
const re = /\S+@\S+\.\S+/;
const LoginScreen = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{marginTop: 128}}>
        <View style={{marginBottom: 32}}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>
        <TextInput
          autoCapitalize="none"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => {
            setEmail(text);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          textContentType="password"
        />
        <Button
          disabled={!re.test(email) || password === ''}
          title="Login"
          onPress={() => {
            setLoading(true);
            dispatch(
              login(
                {email, password},
                () => {
                  setLoading(false);
                },
                error => {
                  setError(error);
                  setLoading(false);
                  setShowAlert(true);
                  setPassword('')
                },
              ),
            );
          }}
        />
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={error}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Ok"
          confirmButtonColor="#DD6B55"
          contentContainerStyle={{
            borderRadius: 8,
          }}
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            setShowAlert(false);
          }}
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
          <ActivityIndicator
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            size={'large'}
            color="darkslateblue"
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginHorizontal: 12,
  },
  input: {
    backgroundColor: colors.special2,
    borderRadius: 4,
    paddingLeft: 16,
    paddingRight: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoginScreen;
