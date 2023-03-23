import react, {useState, useEffect} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import colors from '../../const/colors';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signup = async () => {
    const res = await axios.post('http://192.168.1.5:5000/api/auth/signup', {
      name,
      email,
      password,
    });
    console.log(res.data);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={{marginTop: 128}}>
        <View style={{marginBottom: 32}}>
          <Text style={styles.title}>SignUp</Text>
          <Text style={styles.subtitle}>Create new account</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={text => {
            setName(text);
          }}
        />
        <TextInput
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
        />
        <Button title="Signup" onPress={signup} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
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

export default Signup;
