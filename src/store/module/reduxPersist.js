import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default (reducers) => {
  const persistedReducers = persistReducer(
    {
      key: 'RECAT_BASE',
      storage,
      whitelist: ['example'],
    },
    reducers
  );

  return persistedReducers;
};
