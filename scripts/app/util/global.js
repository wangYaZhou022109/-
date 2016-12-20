var jQuery = require('jquery'),
    _ = require('lodash/collection'),
    setting = {},
    currentUser = {},
    options = { url: '.' + window.app.options.urlRoot + '/system/setting', method: 'GET', dataType: 'json' };

jQuery.ajax(options).done(function(data) {
    _.map(data.setting, function(v) { setting[v.key] = v.value; });
    _.map(data.currentUser, function(v, item) { currentUser[item] = v; });
});

exports.setting = function() {
    return setting;
};

exports.currentUser = function() {
    return currentUser;
};
