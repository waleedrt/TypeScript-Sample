import { effectsMiddleware } from 'redux-effex';
import { apiMiddleware } from 'redux-api-middleware';
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { persistStore, persistReducer, createMigrate } from 'redux-persist';

import config from './config';

import { reducers as MainReducer } from '../src/main';
import {
  WorkflowReducer,
  WorkflowHistoryReducer,
} from '../src/workflows/redux/reducers';
import { reducers as WellbeingReducer } from '../src/userProfile';
import { reducers as MYDReducer } from '../src/myd';
import { reducers as AuthReducer } from '../src/auth';
import featureConstants from '../src/constants/features';

import effects from './configureEffects';
import authMiddleware from '../src/middleware/authMiddleware';
import { AuthReduxStoreType } from '../src/auth/reducers';
import { MainReduxStoreType } from '../src/main/reducers';
import { MYDReduxStoreType } from '../src/myd/reducers';
import { UserProfileReduxStoreType } from '../src/userProfile/reducers';
import { WorkflowsReduxStoreType } from '../src/workflows/redux/reducers/workflowReducers';
import { WorkflowHistoryReduxStoreType } from '../src/workflows/redux/reducers/workflowHistoryReducers';

const middleware = [authMiddleware, apiMiddleware, effectsMiddleware(effects)];

export const rootReducer = combineReducers({
  [featureConstants.MAIN]: MainReducer,
  [featureConstants.AUTH]: AuthReducer,
  [featureConstants.CUP]: WellbeingReducer,
  [featureConstants.MYD]: MYDReducer,
  [featureConstants.WORKFLOWS]: WorkflowReducer,
  [featureConstants.WORKFLOW_HISTORY]: WorkflowHistoryReducer,
});

export type RootReduxType = {
  main: MainReduxStoreType;
  auth: AuthReduxStoreType;
  chronologicalUserProfile: UserProfileReduxStoreType;
  myd: MYDReduxStoreType;
  workflows: WorkflowsReduxStoreType;
  workflowHistory: WorkflowHistoryReduxStoreType;
  _persist: {
    version: number;
    rehydrated: boolean;
  };
};

const reduxMigrationsForAppVersions = {
  2: (state: RootReduxType) => {
    return { _persist: state._persist };
  },
  3: (state: RootReduxType) => {
    return { _persist: state._persist };
  },
  4: (state: RootReduxType) => {
    return { _persist: state._persist };
  },
  // Version 1.9
  5: (state: RootReduxType) => {
    return { _persist: state._persist };
  },
  // Version 1.10
  6: (state: RootReduxType) => {
    return { _persist: state._persist };
  },
  // Version 1.11
  7: (state: RootReduxType) => {
    return { _persist: state._persist };
  },
};

const persistConfig = {
  key: 'root',
  version: config.persist.version,
  storage: AsyncStorage,
  migrate: createMigrate(reduxMigrationsForAppVersions, { debug: true }),
  // debug: true,
};

// wrapper for persisting state to specified storage engine
const persistedRootReducer = persistReducer(persistConfig, rootReducer);

// TODO: Make sure to make this conditional prior to release.
const reactotron = Reactotron.configure({ name: config.app.name }) // controls connection & communication settings
  .use(reactotronRedux())
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

// Clear Reactotron timeline when app restarts
reactotron.clear();

// Monkey patch console.log to send log to reactotron
const originalConsoleLog = console.log; // eslint-disable-line no-console
console.log = (...args) => {
  // eslint-disable-line no-console
  originalConsoleLog(...args);
  Reactotron.display({
    name: 'CONSOLE.LOG',
    value: args,
    preview: args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
  });
};
// }

export const store = createStore(
  persistedRootReducer,
  compose(applyMiddleware(...middleware), reactotron.createEnhancer())
);

export const persistor = persistStore(store);
