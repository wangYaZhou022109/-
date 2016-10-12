var D, H, jQuery, app, helpers, oauthOptions, plupload;

oauthOptions = {
    clientId: 11,
    provider: 'http://192.168.1.198:8888/oauth',
    returnTo: 'http://192.168.3.191'
};

window.$ = window.jQuery = jQuery = require('jquery');
jQuery.ajaxSetup({ cache: false });
jQuery(document).on('submit', 'form', function() {
    return false;
});

H = require('handlebars/runtime');
helpers = require('./app/util/helpers');
jQuery.each(helpers, function(k, v) {
    H.registerHelper(k, v);
});

require('es5-shim');
D = require('drizzlejs');

D.registerRegion('multiple', D.MultiRegion);

plupload = require('./vendors/upload/moxie.min');
window.moxie = plupload.moxie;
window.mOxie = plupload.mOxie;

require('./vendors/alertify');
require('./vendors/upload/plupload.min');
require('./vendors/upload/jquery.plupload.queue.min');
require('./vendors/upload/zh_CN');
require('./app/ext/tree');
require('./app/ext/tag-view');
require('./app/ext/picker');
require('./app/ext/selectize');
require('./app/ext/component-pager');
require('./app/ext/perfect-scrollbar');
require('./app/ext/pickadate');
require('./app/ext/upload');
require('./app/ext/modules/tree-grid/tree-grid-module');
require('./app/ext/modules/form/form-view');
require('./app/ext/extention');
require('./app/ext/question');
require('./app/ext/exam-step');
require('./app/ext/rich-text');

D.adapt({
    getFormData: function(form) {
        var result = {};
        jQuery.each(jQuery(form).serializeArray(), function(i, item) {
            result[item.name] = item.value;
        });
        return result;
    },
    exportError: function(e) {
        window.console && window.console.error(e.stack ? e.stack : e);
    },
    addEventListener: function(el, name, handler) {
        jQuery(el).on(name, handler);
    },
    removeEventListener: function(el, name, handler) {
        jQuery(el).off(name, handler);
    },
    hasClass: function(el, clazz) { return jQuery(el).hasClass(clazz); },
    addClass: function(el, clazz) { jQuery(el).addClass(clazz); },
    removeClass: function(el, clazz) { jQuery(el).removeClass(clazz); },
    eventPrevented: function(e) {
        if (e.isDefaultPrevented) return e.isDefaultPrevented();
        return e.defaultPrevented;
    }
});

app = window.app = new D.Application({
    container: document.getElementById('content'),
    urlRoot: '/api/v1',
    getResource: function(path) {
        return require('./' + path);    // eslint-disable-line global-require
    },
    routers: ['']
});
D.assign(app.global, {
    ADD: '1',
    EDIT: '2',
    REMOVE: '3',
    OTHER: '4'
});

D.PageableModel.setDefault({
    pageKey: 'page'
});

require('./app/util/push-state').setup(app);
require('./app/util/oauth').setup(app, oauthOptions);
require('./app/util/message').setup(app);
require('./app/util/ajax').setup(app);

app.start('permission/demo').then(function() {
    if (!window.history.pushState) {
        app.dispatch('pushState', window.location.hash.slice(1));   // for ie8
    }
});
