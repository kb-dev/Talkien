import { createStore } from 'redux';
import { persistCombineReducers, persistStore } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import rootReducer from './../reducers';

const config = {
    timeout: 20000,
    key: 'root-v5',
    storage: AsyncStorage,
};
const reducer = persistCombineReducers(config, rootReducer);

export default () => {
    const store = createStore(reducer);
    const pStore = persistStore(store);
    return { store, pStore };
};
