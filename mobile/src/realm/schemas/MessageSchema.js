const MessageSchema = {
  name: 'Message',
  properties: {
    _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
    sender: 'string',
    receiver: 'string',
    content: 'string',
    type: 'string',
    sendAt: {type: 'date', default: () => new Date()},
  },
  primaryKey: '_id',
};

export default MessageSchema;
