import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { RootReduxType } from '../../config/configureStore';
import { refreshTokens } from '../auth/actionCreators';

/**
 * You can use this hook to consider OAuth token renewal
 * when a component gains focus. It is currently only
 * used on the home screen and it may introduce race
 * conditions if this was used in more than one place...
 */
export default function useRenewAuthTokenOnFocus() {
  const [isTokenValidated, setIsTokenValidated] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      // When the component this hook is used on comes back into focus...
      if (oAuthTokenStatus === 'Requested') {
        console.log(
          'useFocusEffect: There is currently an in-flight request for a new OAuth Token.'
        );
      } else if (oAuthTokenStatus === 'Received') {
        // And the current token is past it's acceptable age request a new token...
        if (
          oAuthTokenExpiration &&
          moment(oAuthTokenExpiration).diff(moment(), 'seconds') < 16000
        ) {
          console.log(
            'useFocusEffect: Requesting New OAuth Token due to Component Focus'
          );
          dispatch(refreshTokens(oAuthRefreshToken));
        } else {
          console.log('useFocusEffect: OAuth Token Validated');
          setIsTokenValidated(true);
        }
      }

      // We set the value to false here so that when
      // the screen this is implemented on comes back into
      // focus it will evaluate our criteria for nenewal
      // before assuming everything is ok.
      return () => setIsTokenValidated(false);
    }, [oAuthTokenExpiration])
  );

  // Note that the initial value of `false` appears to always be
  // returned on the first render.
  return isTokenValidated;
}
