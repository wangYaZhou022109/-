var WS = window.WebSocket || null,
    D = require('drizzlejs'),
    timeout = 5000,
    DELTA = 45000,
    ExamSocket = {},
    // STOP = 'stop',
    // RUNNING = 'running',
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

        D.assign(this, {
            app: app,
            url: url + prefix + '/ws/exam',
            requests: {},
            lastTime: new Date().getTime(),
            examId: examId,
            callbacks: callbacks
            // state: STOP
        });

        this.connect();
    },

    //  创建websocket，进行连接
    connect: function() {
        if (this.isActive()) return;

        this.socket = this.createSocket(ExamSocket.url);
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

    //  发送消息
    send: function(data) {
        var opt = { headers: {} },
            oauth = this.app.global.OAuth,
            requests = this.requests,
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

        this.socket.send(JSON.stringify(opt));
        this.lastTime = new Date().getTime();

        //  定时清除请求缓存
        timeoutId = setTimeout(function() {
            if (!requests[opt.id]) return;
            requests[opt.id].reject();
            delete requests[opt.id];
        }, timeout);

        return this.app.Promise.create(function(resolve, reject) {
            requests[opt.id] = { resolve: resolve, reject: reject, timeoutId: timeoutId };
        });
    },

    close: function() {
        if (this.isActive()) this.socket.close();
        delete this.socket;
    },

    // 连接后发送消息
    onOpen: function() {
        var me = this;
        this.send({ examId: this.examId }).then(function() {
            me.startHeartBeat();
        }, function() {
            me.connect();
        });
    },

    //  回调业务
    onMessage: function(msg) {
        var callbacks = this.callbacks;

        if (msg === SUBMIT_PAPER) callbacks[SUBMIT_PAPER]();

        if (msg && msg.indexOf('timeExpand_') > -1) {
            callbacks[TIME_EXPAND](msg.substring(11));
        }

        if (msg && msg.indexOf('joined:') > -1) {
            if (ExamSocket.requests[msg.substring(7)].resolve) {
                ExamSocket.requests[msg.substring(7)].resolve();
                delete ExamSocket.requests[msg.substring(7)];
            }
        }
    },

    onClose: function(e) {
        if (e.code === 1013) this.connect();
    },

    startHeartBeat: function() {
        var me = this;
        this.stopHeartBeat();
        this.heartBeat = setInterval(function() {
            var current = new Date().getTime(),
                delta = current - me.lastTime;

            if (!me.isActive()) {
                me.stopHeartBeat();
                return;
            }

            if (delta > DELTA) {
                me.socket.send('PING');
                me.lastTime = new Date().getTime();
            }
        }, 10000);
    },

    stopHeartBeat: function() {
        if (!this.heartBeat) return;
        clearInterval(this.heartBeat);
        delete this.heartBeat;
    },

    isActive: function() {
        return this.socket && this.socket.readyState === WS.OPEN;
    }
};
