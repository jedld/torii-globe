import Oauth2 from 'torii/providers/oauth2-code';
import {configurable} from 'torii/configuration';

var GlobeOauth2 = Oauth2.extend({

  name:    'globe',
  baseUrl: 'https://developer.globelabs.com.ph/dialog/oauth',

  // additional params that this provider requires
  requiredUrlParams: ['app_id'],

  responseParams: ['code'],

  approvalPrompt: configurable('approvalPrompt', 'auto'),

  redirectUri: configurable('redirectUri',
                            'http://localhost:8000/oauth2callback'),
});

export default GlobeOauth2;
