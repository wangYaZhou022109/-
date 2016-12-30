var jQuery = require('jquery'),
    _ = require('lodash/collection'),
    setting = {},
    currentUser = {},
    D = require('drizzlejs');
exports.setup = function(app) {
    var root, options;
    root = app;
    options = {
        url: root.options.urlRoot + '/system/setting',
        method: 'GET',
        dataType: 'json'
    };
    jQuery.ajax(options).done(function(data) {
        _.map(data.setting, function(v) {
            setting[v.key] = v.value;
        });
        _.map(data.currentUser, function(v, item) {
            currentUser[item] = v;
        });
    });
    D.assign(root.global, {
        setting: setting
    });
    D.assign(root.global, {
        currentUser: currentUser
    });
};
