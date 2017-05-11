var $ = require('jquery'),
    _ = require('lodash/collection');
exports.bindings = {
    menus: true,
    navs: true
};

exports.dataForTemplate = {
    menus: function(data) {
        return data.menus;
    },
    navs: function(data) {
        var navs = data.navs || [];
        navs = _.reject(navs, ['show', 0]);
        _.map(navs, function(item) {
            var r = item;
            r.link = false;
            if (r.url.indexOf('http') > -1) {
                r.link = true;
            }
        });
        return navs;
    }
};

exports.events = {
    'click menu-*': 'showContent'
};

exports.handlers = {
    showContent: function(id, e, element) {
        var url = element.getAttribute('href').slice(2),
            params = {};
        $(window).unbind('scroll');
        if (url === 'home' && document.cookie) {
            document.cookie.split('; ').forEach(function(item) {
                var arr = item.split('=');
                if (arr[1] !== 'undefined' || arr[1] !== '') {
                    params[arr[0]] = arr[1];
                }
            });
            if (params.orgId) {
                url = url + '/org/' + params.orgId;
            }
            this.app.navigate(url, true);
        }
        this.app.navigate(url, true);
    }
};
