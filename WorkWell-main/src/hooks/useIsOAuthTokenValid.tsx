import { useSelector } from 'react-redux';
import moment from 'moment';

import { RootReduxType } from '../../config/configureStore';

export default function useIsOAuthTokenValid() {
  const oAuthTokenStatus = useSelector(
    (state: RootReduxType) => state.auth.tokens.status
  );
  const oAuthTokenExpiration = useSelector(
    (state: RootReduxType) => state.auth.tokens.expires
  );
  return oAuthTokenStatus === 'Received' &&
    moment(oAuthTokenExpiration).diff(moment(), 'seconds') >= 16000
    ? true
    : false;
}
