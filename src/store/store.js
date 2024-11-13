import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage for persistence
import Auth from '../Reducers/Auth';
import Booking from '../Reducers/Booking';
import SaveNumber from '../Reducers/saveNumber';
import HotelData from '../Reducers/hotelData';
import AmenitiesData from '../Reducers/amenitiesReducerData';
import SubscriptionData from '../Reducers/SubscriptionData';

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// Combine your reducers here
const rootReducer = combineReducers({
  Auth,
  Booking,
  SaveNumber,
  HotelData,
  AmenitiesData,
  SubscriptionData
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middleware setup
const middlewares = [thunk];
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger); // Use logger in development mode only
}

// Fallback for Redux DevTools
const composeEnhancers =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

// Create store with persisted reducer, middleware, and devtools
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

// Create persistor for the store
export const persistor = persistStore(store);

// Export the store
export default store;
