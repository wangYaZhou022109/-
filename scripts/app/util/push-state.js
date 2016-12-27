var $ = require('jquery'),
    pushState = window.history.pushState,
    getHash = function() {
        return window.location.hash.slice(1);
    };

exports.setup = function(app) {
    var root = app;
    root.global.uri = getHash();
    if (pushState) {
        window.history.pushState = function() {
            pushState.apply(window.history, arguments);
            app.dispatch('pushState', getHash());
        };
    }
    $(window).on('hashchange', function() {
        app.dispatch('pushState', getHash());
    });
};
