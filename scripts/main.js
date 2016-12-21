var D, H, jQuery, app, helpers, oauthOptions, plupload, customGlobal;

oauthOptions = {
    clientId: 22,
    provider: 'https://oauth9.zhixueyun.com',
    returnTo: 'http://192.168.9.121/front'
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

D = require('drizzlejs');

plupload = require('./vendors/upload/moxie.min');
window.moxie = plupload.moxie;
window.mOxie = plupload.mOxie;

require('./vendors/alertify');
require('./vendors/upload/plupload.min');
require('./vendors/upload/jquery.plupload.queue.min');
require('./vendors/upload/zh_CN');
require('./app/component/component-pager');
require('./app/component/upload');
require('./app/component/comment-area');
require('./app/component/swiper');
require('./app/component/views/form/form-view');

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
    routerPrefix: '#/',
    getResource: function(path) {
        return require('./' + path);    // eslint-disable-line global-require
    },
    routers: ['', 'home', 'course', 'activity', 'study-subject']
});
D.assign(app.global, {});

D.PageableModel.setDefault({
    pageKey: 'page'
});

require('./app/util/oauth').setup(app, oauthOptions);
require('./app/util/message').setup(app);
require('./app/util/ajax').setup(app);

customGlobal = require('./app/util/global');

D.assign(app.global, {
    setting: customGlobal.setting()
});
D.assign(app.global, {
    currentUser: customGlobal.currentUser()
});
app.start('home');
