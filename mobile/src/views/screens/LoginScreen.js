import {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import colors from '../../const/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {login} from '../../store/actions/auth';
const LoginScreen = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{marginTop: 128}}>
        <View style={{marginBottom: 32}}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>
        <TextInput
        autoCapitalize='none'
        textContentType='emailAddress'
        keyboardType='email-address'
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
          title="Login"
          onPress={() => dispatch(login({email, password}))}
        />
      </View>
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
