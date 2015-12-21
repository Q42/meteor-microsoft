Microsoft = {

    serviceName: 'microsoft',
    // https://msdn.microsoft.com/en-us/library/office/dn659736.aspx
    whitelistedFields: ['id', 'emails', 'first_name', 'last_name', 'name', 'gender', 'locale'],

    retrieveCredential: function(credentialToken, credentialSecret) {
        return OAuth.retrieveCredential(credentialToken, credentialSecret);
    }
};

OAuth.registerService(Microsoft.serviceName, 2, null, function(query) {

    var response = getTokens(query),
        expiresAt = (+new Date) + (1000 * parseInt(response.expiresIn, 10)),
        identity = getIdentity(response.accessToken),
        serviceData = {
            accessToken: response.accessToken,
            idToken: response.idToken,
            expiresAt: expiresAt,
            scope: response.scope
        };

    var fields = _.pick(identity, Microsoft.whitelistedFields);
    _.extend(serviceData, fields);

    // only set the token in serviceData if it's there. this ensures
    // that we don't lose old ones (since we only get this on the first
    // log in attempt)
    if (response.refreshToken)
        serviceData.refreshToken = response.refreshToken;

    return {
        serviceData: serviceData,
        options: {profile: {name: identity.name}}
    };
});

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
// - refreshToken, if this is the first authorization request
var getTokens = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: Microsoft.serviceName});
    if (!config) {
        throw new ServiceConfiguration.ConfigError();
    }

    var response;
    try {
        response = HTTP.post(
            "https://login.live.com/oauth20_token.srf", {params: {
                code: query.code,
                client_id: config.clientId,
                client_secret: OAuth.openSecret(config.secret),
                redirect_uri: OAuth._redirectUri(Microsoft.serviceName, config),
                grant_type: 'authorization_code'
            }});
    } catch (err) {
        throw _.extend(
            new Error("Failed to complete OAuth handshake with Microsoft. " + err.message),
            {response: err.response}
        );
    }

    if (response.data.error) { // if the http response was a json object with an error attribute
        throw new Error("Failed to complete OAuth handshake with Microsoft. " + response.data.error);
    } else {
        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in,
            idToken: response.data.id_token
        };
    }
};

var getIdentity = function (accessToken) {
    try {
        return HTTP.get(
            "https://apis.live.net/v5.0/me",
            { params: { access_token: accessToken } }).data;
    } catch (err) {
        throw _.extend(
            new Error("Failed to fetch identity from Microsoft. " + err.message),
            { response: err.response }
        );
    }
};