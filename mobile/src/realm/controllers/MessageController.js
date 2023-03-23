import getRealm from '..';
export const getRoomMessages = async user_id => {
  const realm = await getRealm();
  const messages = realm.objects('Message');
  const roomMessages = messages.filtered(`sender = '${user_id}' OR receiver ='${user_id}'`).sorted('sendAt',true);
  return roomMessages;
};

export const getLastMessage = async user_id => {
  const realm = await getRealm();
  const messages = realm.objects('Message');
  const roomMessages = messages.filtered(`sender = '${user_id}' OR receiver ='${user_id}'`).sorted('sendAt',true);

  return roomMessages[0];
};

export const storeMessage = async message => {
  const realm = await getRealm();
  realm.write(() => {
    realm.create('Message', message);
  });
  return 'Message stored';
};
export const deleteMessage = async message => {
  const realm = await getRealm();
  realm.write(() => {
    realm.delete(message);
  });
  return 'Message deleted';
};
export const deleteAll = async message => {
  const realm = await getRealm();
  realm.write(() => {
    realm.deleteAll();
  });
};
