import Provider from 'torii/providers/base';
import {configurable} from 'torii/configuration';
import QueryString from 'torii/lib/query-string';

var GlobeOauth2 = Provider.extend({
  name: 'globe',
  baseUrl: 'https://developer.globelabs.com.ph/dialog/oauth',
  requiredUrlParams: ['app_id'],
  responseParams: ['code'],
  approvalPrompt: configurable('approvalPrompt', 'auto'),
  responseType: 'code',
  appId: configurable('appId'),

  buildQueryString: function() {
    var requiredParams = this.get('requiredUrlParams');

    var qs = QueryString.create({
      provider: this,
      requiredParams: requiredParams,
    });
    return qs.toString();
  },

  buildUrl: function() {
    var base = this.get('baseUrl');
    var qs   = this.buildQueryString();

    return [base, qs].join('?');
  },

  /**
   * @method open
   * @return {Promise<object>} If the authorization attempt is a success,
   * the promise will resolve an object containing the following keys:
   *   - authorizationCode: The `code` from the 3rd-party provider
   *   - provider: The name of the provider (i.e., google-oauth2)
   *   - redirectUri: The redirect uri (some server-side exchange flows require this)
   * If there was an error or the user either canceled the authorization or
   * closed the popup window, the promise rejects.
   */
  open: function(options) {
    var name        = this.get('name');
    var url         = this.buildUrl();
    var redirectUri = this.get('redirectUri');
    var responseParams = this.get('responseParams');
    var responseType = this.get('responseType');

    return this.get('popup').open(url, responseParams, options).then(function(authData) {
      var missingResponseParams = [];

      responseParams.forEach(function(param) {
        if (authData[param] === undefined) {
          missingResponseParams.push(param);
        }
      });

      if (missingResponseParams.length) {
        throw new Error("The response from the provider is missing " +
              "these required response params: " + missingResponseParams.join(', '));
      };

      return {
        authorizationCode: authData[responseType],
        provider: name,
      };
    });
  },
});

export default GlobeOauth2;
