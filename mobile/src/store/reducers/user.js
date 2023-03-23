export default (user = false, action) => {
  switch (action.type) {
    case 'SIGNUP':
      return action.payload;
    case 'LOGIN':
      return action.payload;
    case 'UPDATE':
      return {...user,result:action.payload};
    case 'LOGOUT':
      return false;
    default:
      return user;
  }
};
