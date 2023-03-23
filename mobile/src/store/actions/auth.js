import axios from 'axios';
import * as api from '../../api';
import { Alert } from 'react-native';

const authUrl = api.getUrl('Auth');
export const signup = newUser => async dispatch => {
  try {
    const {data} = await axios.post(`${authUrl}/signup`, newUser);
    console.log(data);
    dispatch({type: 'SIGNUP', payload: data});
  } catch (error) {
    console.log(error.message);
  }
};

export const login = credential => async dispatch => {
  try {
    const {data} = await axios.post(`${authUrl}/login`, credential);
    console.log(data);
    dispatch({type: 'LOGIN', payload: data});
  } catch (error) {
    console.log(error.message);
  }
};
export const updateUser = (user) => async dispatch => {
  try {
     const {data} = await axios.put(`${authUrl}/update`, user);
     console.log(data)
     dispatch({type: 'UPDATE', payload: data.result});
     Alert.alert("","Your informations was updated")
  } catch (error) {
    console.log(error.message);
  }
};
export const logout = () => async dispatch => {
  try {
    dispatch({type: 'LOGOUT',payload:false});
  } catch (error) {
    console.log(error.message);
  }
};
