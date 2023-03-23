import {io} from 'socket.io-client';
const socket = io('http://192.168.1.5:5000');
export default socket;