var WS = window.WebSocket || null,
    D = require('drizzlejs'),
    timeout = 5000,
    DELTA = 45000,
    ExamSocket = {},
    STOP = 'stop',
    RUNNING = 'running',
    SUBMIT_PAPER = 'submitPaper',
    TIME_EXPAND = 'timeExpand';

exports.connect = function(examId, callbacks) {
    ExamSocket.open(window.app, examId, callbacks);
};

exports.disconnect = function() {
    ExamSocket.close();
};

ExamSocket = {
    //  初始化websocket
    open: function(app, examId, callbacks) {
        var prefix = app.options.urlRoot + '/exam',
            url = window.location.protocol === 'http:' ? 'ws://' : 'wss://';

        // url += window.location.host + window.location.pathname;
        url += window.location.host;

        if (url.slice(-1) === '/') url = url.slice(0, -1);

        D.assign(ExamSocket, {
            app: app,
            url: url + prefix + '/ws/exam',
            requests: {},
            lastTime: new Date().getTime(),
            examId: examId,
            callbacks: callbacks,
            state: STOP
        });

        ExamSocket.connect();
    },

    //  创建websocket，进行连接
    connect: function() {
        ExamSocket.state = RUNNING;

        if (ExamSocket.isActive()) ExamSocket.socket.close();

        ExamSocket.socket = ExamSocket.createSocket(ExamSocket.url);
    },

    //  发送消息
    send: function(data) {
        var opt = { headers: {} },
            oauth = ExamSocket.app.global.OAuth,
            requests = ExamSocket.requests,
            timeoutId,
            //  设置请求权限
            setHeaderAuth = function() {
                opt.headers.Authorization = oauth.tokenType + '__' + oauth.token.access_token;
            };

        if (oauth) setHeaderAuth();

        D.assign(opt, {
            data: data,
            id: D.uniqueId('S'),
            url: ''
        });

        ExamSocket.socket.send(JSON.stringify(opt));
        ExamSocket.lastTime = new Date().getTime();

        //  定时清除请求缓存
        timeoutId = setTimeout(function() {
            if (!requests[opt.id]) return;
            requests[opt.id].reject();
            delete requests[opt.id];
        }, timeout);

        return ExamSocket.app.Promise.create(function(resolve, reject) {
            requests[opt.id] = { resolve: resolve, reject: reject, timeoutId: timeoutId };
        });
    },

    close: function() {
        ExamSocket.state = STOP;
        if (ExamSocket.isActive()) ExamSocket.socket.close();
        delete ExamSocket.socket;
    },

    // 连接后发送消息
    onOpen: function() {
        ExamSocket.send({ examId: ExamSocket.examId }).then(function() {
            ExamSocket.startHeartBeat();
        }, function() {
            if (ExamSocket.state !== STOP) ExamSocket.connect();
        });
    },

    //  回调业务
    onMessage: function(msg) {
        var callbacks = ExamSocket.callbacks;

        if (msg === SUBMIT_PAPER) callbacks[SUBMIT_PAPER]();

        if (msg && msg.indexOf('timeExpand_') > -1) {
            callbacks[TIME_EXPAND](msg.substring(11));
        }

        if (msg && msg.indexOf('joined:') > -1) {
            ExamSocket.requests[msg.substring(7)].resolve();
            delete ExamSocket.requests[msg.substring(7)];
        }
    },

    onClose: function() {
        if (ExamSocket.state !== STOP) ExamSocket.connect();
    },

    createSocket: function(url) {
        var socket = new WS(url),
            me = this;

        socket.onopen = function() {
            if (me.callbacks && me.onMessage) {
                me.onOpen();
            }
        };

        socket.onmessage = function(e) {
            if (e.data === 'PANG') {
                return;
            }
            if (me.callbacks && me.onMessage) {
                me.onMessage(e.data);
            }
        };

        socket.onclose = function(e) {
            if (me.callbacks && me.onClose) {
                me.onClose(e);
            }
        };

        return socket;
    },

    startHeartBeat: function() {
        ExamSocket.stopHeartBeat();
        ExamSocket.heartBeat = setInterval(function() {
            var current = new Date().getTime(),
                delta = current - ExamSocket.lastTime;

            if (!ExamSocket.isActive()) {
                ExamSocket.stopHeartBeat();
                return;
            }

            if (delta > DELTA) {
                ExamSocket.socket.send('PING');
                ExamSocket.lastTime = new Date().getTime();
            }
        }, 10000);
    },

    stopHeartBeat: function() {
        if (!ExamSocket.heartBeat) return;
        clearInterval(ExamSocket.heartBeat);
        delete ExamSocket.heartBeat;
    },

    isActive: function() {
        return ExamSocket.socket && ExamSocket.socket.readyState === WS.OPEN;
    }
};
