var D, H, jQuery, app, helpers, oauthOptions, plupload,
    _ = require('lodash/collection'),
    setting = {},
    currentUser = {},
    webConfig = {};

oauthOptions = {
    clientId: 999,
    provider: 'https://oauth9.zhixueyun.com/',
    returnTo: 'https://dev9.zhixueyun.com'
};

// @ifndef PRODUCTION
oauthOptions = {
    clientId: 3,
    // provider: 'https://oauth9.zhixueyun.com/',
    provider: 'https://zxyoauth9.zhixueyun.com/',
    returnTo: 'http://localhost/front'
};
// @endif

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

require('jquery-ui-monthpicker/jquery.ui.monthpicker');
require('highcharts/highcharts.src');
require('./vendors/alertify');
require('./vendors/upload/plupload.min');
require('./vendors/upload/jquery.plupload.queue.min');
require('./vendors/upload/zh_CN');
require('./app/ext/component-pager');
require('./app/ext/picker');
require('./app/ext/swiper');
require('./app/ext/tag-view');
require('./app/ext/upload');
require('./app/ext/models/local-storage-model');
require('./app/ext/selectize');
require('./app/ext/views/form/form-view');
require('./app/ext/views/dynamic-view');
require('./app/ext/pdf');
require('./app/ext/videojs');
require('./app/ext/tree');
require('./app/ext/audio-wavesurfer');
require('./app/ext/photoswipe');
require('./app/ext/highcharts');
require('./app/main/modal/modal-region');
require('./app/ext/flatpickr');
require('./app/ext/tree');
require('./app/ext/qr-code');
require('./app/ext/rich-text');
require('./app/ext/monthpicker');
require('./app/util/arrays');
require('./app/ext/image-cropper');
require('./app/ext/clipboard');
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
    routers: ['', 'home', 'study', 'activity', 'exam', 'person', 'news', 'train', 'knowledge', 'ask-new', 'center',
        'ask']
});

D.PageableModel.setDefault({
    pageKey: 'page'
});
require('./app/util/push-state').setup(app);
require('./app/util/oauth').setup(app, oauthOptions);
require('./app/util/message').setup(app);
require('./app/util/ajax').setup(app);
require('./app/util/global').setup(app).then(function(data) {
    _.map(data.setting, function(v) {
        setting[v.key] = v.value;
    });
    _.map(data.currentUser, function(v, item) {
        currentUser[item] = v;
    });
    _.map(data.webConfig, function(v, item) {
        webConfig[item] = v;
    });
    D.assign(app.global, { setting: setting });
    D.assign(app.global, { currentUser: currentUser });
    D.assign(app.global, { webConfig: webConfig });
    D.assign(app.global, { organization: data.organization });
    D.assign(app.global, { roleLength: data.roleLength });
}, function() {
    app.message.error('加载初始化数据出错');
    return app.Promise.reject();
}).then(function() {
    app.start('home').then(function() {
        window.document.title = webConfig.value;
        if (!window.history.pushState) {
            app.dispatch('pushState', window.location.hash.slice(1));   // for ie8
        }
    });
});
