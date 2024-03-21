import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { RootReduxType } from '../../config/configureStore';
import { refreshTokens } from '../auth/actionCreators';
import { setAppState } from '../main/actionCreators';

/**
 * This hook is used to handle token refresh when the app
 * comes back into an "active" state after being in the background.
 *
 * NOTE: It is very important that this component only exist
 * in a single place in the component hierarchy.
 */
export default function useRenewAuthTokenOnAppRefocus() {
  const currentAppState = useRef<'active' | 'inactive' | 'background' | null>(
    null
  );

  const [considerNewTokenRequest, setConsiderNewTokenRequest] = useState(false);
  const [syncActiveStateToRedux, setSyncActiveStateToRedux] = useState(false);
  const [waitedOneCycle, setWaitedOneCycle] = useState(false);

  const dispatch = useDispatch();

  const oAuthTokenStatus = useSelector(
    (state: RootReduxType) => state.auth.tokens.status
  );
  const oAuthTokenExpiration = useSelector(
    (state: RootReduxType) => state.auth.tokens.expires
  );
  const oAuthRefreshToken = useSelector(
    (state: RootReduxType) => state.auth.tokens.refresh_token
  );

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log(currentAppState.current, nextAppState);

    // If this app is coming back from an inactive or background state,
    // we need to verify that the OAuth token is still valid.
    if (currentAppState.current !== 'active' && nextAppState === 'active') {
      setWaitedOneCycle(false);
      setConsiderNewTokenRequest(true);

      /**
       * Internally store that the application is now in an active state,
       * but don't update Redux yet. This will happen later.
       *
       * The reason for this is that other components look at the Redux
       * representation of app state to determine if they are clear to do
       * their own actions and we don't want to signal we are ready
       * before the token has been refreshed (if it needs to be).
       */
      currentAppState.current = nextAppState;
    } else {
      setConsiderNewTokenRequest(false);

      // Sync application state to Redux for other components
      currentAppState.current = nextAppState;
      dispatch(setAppState(nextAppState));
    }
  };

  // Add the applicaton state change handler.
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  /**
   * This hook handles requests to consider a token refresh.
   */
  useEffect(() => {
    // If there is a request to consider a new token...
    if (considerNewTokenRequest) {
      console.log(
        'Considering Request for OAuth Token Refresh due to App Re-Focus'
      );

      /**
       * IMPORTANT: The `useRenewAuthTokenOnFocus` hook (similar name to this one)
       * tends to fire before this one, so we need to add an intentional wait to
       * avoid a race condition with that component.
       *
       * We do that here.
       */
      if (!waitedOneCycle) {
        console.log(
          'Wait a Single Cycle to avoid conflict with other processes that might renew token.'
        );
        setWaitedOneCycle(true);
        return;
      }

      // And the token is past it's expiration...
      if (
        oAuthTokenExpiration &&
        moment(oAuthTokenExpiration).diff(moment(), 'seconds') < 16000
      ) {
        // If there is already a request pending...
        if (oAuthTokenStatus === 'Requested') {
          console.log(
            'Ignore request for token renewal due to App Re-Focus due to pending renewal.'
          );
        } // If there is NOT already a request pending...
        else {
          console.log('Issue request for new OAuth Token due to App Re-Focus');
          dispatch(refreshTokens(oAuthRefreshToken));
          setSyncActiveStateToRedux(true);
          setConsiderNewTokenRequest(false);
        }
      } else {
        console.log('App Regained Focus, but OAuth Token is Valid');
        setConsiderNewTokenRequest(false);
        setSyncActiveStateToRedux(true);
      }
    }
  }, [
    considerNewTokenRequest,
    oAuthTokenExpiration,
    oAuthTokenStatus,
    waitedOneCycle,
  ]);

  /**
   * Hook that syncs the "active" application state to the Redux store
   * after the tokens have been refreshed (if needed) or
   * verified to be currently valid.
   */
  useEffect(() => {
    if (!syncActiveStateToRedux) return;

    if (
      syncActiveStateToRedux &&
      moment(oAuthTokenExpiration).diff(moment(), 'seconds') >= 16000
    ) {
      console.log('Safe to set application state to active in Redux');
      dispatch(setAppState('active'));
      setSyncActiveStateToRedux(false);
    }
  }, [syncActiveStateToRedux, oAuthTokenExpiration]);
}
