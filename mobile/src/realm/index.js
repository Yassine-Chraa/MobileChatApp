import Realm from 'realm';
import MessageSchema from './schemas/MessageSchema';

export default getRealm = () => {
  return Realm.open({
    schema: [MessageSchema],
    deleteRealmIfMigrationNeeded: true,
  });
};
