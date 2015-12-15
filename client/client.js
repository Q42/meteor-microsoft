Microsoft = {};

// https://msdn.microsoft.com/en-us/library/office/dn659750.aspx

// Request Microsoft credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Microsoft.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    } else if (!options) {
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'microsoft'});
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError());
        return;
    }

    var credentialToken = Random.secret();

    // always need this to get user id from google.
    var scope = ['wl.signin', 'wl.emails'];
    if (options.requestPermissions)
        _.union(scope, options.requestPermissions);

    var loginUrlParameters = {};
    if (config.loginUrlParameters){
        _.extend(loginUrlParameters, config.loginUrlParameters)
    }
    if (options.loginUrlParameters){
        _.extend(loginUrlParameters, options.loginUrlParameters)
    }
    var ILLEGAL_PARAMETERS = ['response_type', 'client_id', 'scope', 'redirect_uri', 'state'];
    // validate options keys
    _.each(_.keys(loginUrlParameters), function (key) {
        if (_.contains(ILLEGAL_PARAMETERS, key))
            throw new Error("Microsoft.requestCredential: Invalid loginUrlParameter: " + key);
    });

    console.log(OAuth._redirectUri('microsoft', config));

    var loginStyle = OAuth._loginStyle('microsoft', config, options);
    // https://msdn.microsoft.com/en-us/library/office/dn659750.aspx
    _.extend(loginUrlParameters, {
        "response_type": "code",
        "client_id":  config.clientId,
        "scope": scope.join(' '), // space delimited
        "redirect_uri": OAuth._redirectUri('microsoft', config),
        "state": OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl)
    });

    console.log(loginUrlParameters);

    var loginUrl = 'https://login.live.com/oauth20_authorize.srf?' +
        _.map(loginUrlParameters, function(value, param){
            return encodeURIComponent(param) + '=' + encodeURIComponent(value);
        }).join("&");

    console.log(loginUrl);

    OAuth.launchLogin({
        loginService: "microsoft",
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken,
        popupOptions: { height: 600 }
    });
};