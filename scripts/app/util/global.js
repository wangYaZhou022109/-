var jQuery = require('jquery'),
    D = require('drizzlejs');
exports.setup = function(app) {
    var options = {
        url: app.options.urlRoot + '/system/setting',
        method: 'GET',
        dataType: 'json',
        timeout: 10000
    };
    return app.Promise.create(function(resolve, reject) {
        D.assign(options, { success: resolve, error: reject });
        jQuery.get(options, resolve, reject);
    });
};
