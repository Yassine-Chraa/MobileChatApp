import reducer from './reducers';
import {configureStore, applyMiddleware, compose} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

export default configureStore(
  {
    reducer,
  },
  compose(applyMiddleware(thunk))
);
