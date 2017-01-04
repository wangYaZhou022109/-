var getAccessTokenFromHash, getAccessTokenFromLocalStorage, _, $, haveReturnedToLogin;
_ = require('lodash/collection');
$ = require('jquery');
haveReturnedToLogin = false;

getAccessTokenFromHash = function() {
    var hash = window.location.hash,
        result = {},
        state;
    if (hash.indexOf('access_token') < 0) return null;
    _.each(hash.slice(1).split('&'), function(v) {
        var s = v.split('=');
        result[s[0]] = s[1];
    });
    state = decodeURIComponent(result.state || 'demo/main');
    delete result.expires_in;
    delete result.state;
    localStorage.setItem('token', JSON.stringify(result));
    window.location.hash = state || 'index';
    return result;
};

getAccessTokenFromLocalStorage = function() {
    var accessTokenStr = localStorage.getItem('token'),
        accessToken;
    if (accessTokenStr) {
        accessToken = JSON.parse(accessTokenStr);
        return accessToken;
    }
    return false;
};

exports.setup = function(app, options) {
    var root = app,
        clientId = options.clientId,
        provider = options.provider,
        returnTo = options.returnTo,
        auth = provider + '/api/v1/auth',
        revoke = provider + '/api/v1/token/' + clientId,
        accessToken = getAccessTokenFromHash() || getAccessTokenFromLocalStorage() || {};

    root.redirectToLogin = function(append) {
        var queryString = '?response_type=token&client_id=' + clientId +
            '&redirect_uri=' + encodeURIComponent(returnTo) +
            '&state=' + encodeURIComponent(window.location.hash.slice(1)) + (append || '');

        if (haveReturnedToLogin) {
            return;
        }

        haveReturnedToLogin = true;
        window.location = auth + queryString;
    };

    root.redirectToRegister = function() {
        window.location = provider + '/#register';
    };

    if (accessToken.access_token) {
        root.global.OAuth = {
            token: accessToken,
            logoutUrl: revoke + '/' + accessToken.access_token,
            redirectUri: returnTo,
            provider: provider,
            tokenType: accessToken.token_type
        };

        $.ajaxSetup({
            beforeSend: function(request) {
                request.setRequestHeader('Authorization', accessToken.token_type + '__' + accessToken.access_token);
            }
        });
    } else if (window.location.search && window.location.search.indexOf('logined') > -1) {
        root.redirectToLogin();
    }
};
