var WS = window.WebSocket || null,
    $ = require('jquery'),
    _ = require('lodash/collection'),
    D = require('drizzlejs'),
    messages = require('./errors'),
    timeout = 5000,
    cache = {},
    Socket, errors, handleError, doAjax, toCacheKey;

errors = {
    401: function(app) {
        app.redirectToLogin();
    },
    403: function(app) {
        app.message.error(messages.get('1'));
    },
    422: function(app, obj) {
        app.message.error(messages.get(obj.errorCode || '2'));
    },
    500: function(app) {
        app.message.error(messages.get('3'));
    }
};

toCacheKey = function(options) {
    var key = (_.map(options.data, function(v, k) { return k + '=' + v; })).join('--');
    return options.url + '##' + key;
};

doAjax = function(options, model) {
    var key;
    if (!model.options.cache || options.type !== 'GET' || options.force) return $.ajax(options);

    key = toCacheKey(options);
    if (cache[key]) return model.Promise.resolve(cache[key]);

    return model.chain($.ajax(options), function(args) {
        cache[key] = args;
        return args;
    });
};

handleError = function(app, status, obj) {
    if (!errors[status]) return false;
    errors[status](app, obj);
    return true;
};

Socket = function(app, prefix) {
    var url = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
    url += window.location.host + window.location.pathname;
    if (url.slice(-1) === '/') url = url.slice(0, -1);

    this.app = app;
    this.prefix = app.options.urlRoot + '/' + prefix;
    this.url = url + this.prefix + '/ws-api';
    this.requests = {};

    this.connect();
};

D.assign(Socket.prototype, {
    connect: function() {
        var me = this;
        if (this.socket && this.isActive()) return;
        this.socket = new WS(this.url);

        this.socket.onmessage = function(e) {
            var obj = JSON.parse(e.data);
            obj.content = JSON.parse(obj.content);
            me.onMessage(obj);
        };

        this.socket.onclose = function(e) {
            if (e.code === 1013) me.connect();
        };
    },

    onMessage: function(obj) {
        var id = obj.id,
            status = obj.status,
            req = this.requests[id];

        if (!req) return;

        if (handleError(this.app, status, obj)) {
            req.reject(obj);
            return;
        }

        if (req.cacheKey) {
            cache[req.cacheKey] = obj.content;
        }

        req.resolve([obj.content]);
        delete this.requests[id];
    },

    isActive: function() {
        return this.socket.readyState === WS.OPEN;
    },

    match: function(url) {
        return this.isActive() && url.indexOf(this.prefix) === 0;
    },

    send: function(options, model) {
        var opt = { headers: {} },
            oauth = this.app.global.OAuth,
            requests = this.requests,
            cacheKey = '',
            timeoutId, needCache;

        if (oauth) {
            opt.headers.Authorization = oauth.tokenType + '__' + oauth.token.access_token;
        }

        opt.headers['User-Agent'] = navigator.userAgent;
        opt.url = options.url;
        opt.method = options.type;
        opt.data = options.data;
        opt.id = D.uniqueId('S');

        cacheKey = toCacheKey(options);
        needCache = model.options.cache && opt.method === 'GET' && !options.force;

        if (needCache) {
            cacheKey = toCacheKey(options);
            if (cache[cacheKey]) return model.Promise.resolve([cache[cacheKey]]);
        }

        this.socket.send(JSON.stringify(opt));
        timeoutId = setTimeout(function() {
            if (!requests[opt.id]) return;
            requests[opt.id].reject();
            delete requests[opt.id];
        }, timeout);
        return this.app.Promise.create(function(resolve, reject) {
            requests[opt.id] = { resolve: resolve, reject: reject, timeoutId: timeoutId, cacheKey: cacheKey };
        });
    }
});

exports.setup = function(app) {
    var sockets = [];

    $(document).on('ajaxComplete', function(e, response) {
        handleError(app, response.status, response.responseText && JSON.parse(response.responseText));
    });

    if (!WS) {
        D.adapt({ ajax: doAjax });
        return;
    }
    sockets.push(new Socket(app, 'system'));
    sockets.push(new Socket(app, 'human'));
    sockets.push(new Socket(app, 'exam'));

    D.adapt({ ajax: function(options, model) {
        var socket = false;
        if (model.options.ajax) return doAjax(options, model);

        socket = sockets.filter(function(item) { return item.match(options.url); })[0];
        if (!socket) return doAjax(options, model);

        return socket.send(options, model);
    } });
};
