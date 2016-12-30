var WS = window.WebSocket || null,
    D = require('drizzlejs'),
    timeout = 5000,
    ExamSocket = {};

exports.connect = function(examId, callbacks) {
    ExamSocket.open(window.app, examId, callbacks);
};

exports.disconnect = function() {
    ExamSocket.close();
};

ExamSocket = {
    open: function(app, examId, callbacks) {
        var prefix = app.options.urlRoot + '/exam',
            url = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
        url += window.location.host + window.location.pathname;
        if (url.slice(-1) === '/') url = url.slice(0, -1);
        ExamSocket.app = app;
        ExamSocket.url = url + prefix + '/ws/exam';
        ExamSocket.requests = {};
        ExamSocket.lastTime = new Date().getTime();
        ExamSocket.examId = examId;
        ExamSocket.callbacks = callbacks;
        ExamSocket.state = 'stop';
        ExamSocket.reOpen();
    },
    reOpen: function() {
        ExamSocket.state = 'running';
        if (ExamSocket.isActive()) {
            ExamSocket.socket.close();
        } else {
            ExamSocket.socket = ExamSocket.createSocket(ExamSocket.url, {
                onMessage: ExamSocket.onMessage,
                onClose: ExamSocket.onClose,
                onError: ExamSocket.onError,
                onOpen: ExamSocket.onOpen
            });
        }
    },
    send: function(data) {
        var opt = { headers: {} },
            oauth = ExamSocket.app.global.OAuth,
            requests = ExamSocket.requests,
            timeoutId;
        if (oauth) {
            opt.headers.Authorization = oauth.tokenType + '__' + oauth.token.access_token;
        }
        opt.data = data;
        opt.id = D.uniqueId('S');
        opt.url = '';
        ExamSocket.socket.send(JSON.stringify(opt));
        ExamSocket.lastTime = new Date().getTime();
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
        ExamSocket.state = 'stop';
        if (ExamSocket.isActive()) {
            ExamSocket.socket.close();
        }
        delete ExamSocket.socket;
    },
    onOpen: function() {
        ExamSocket.send({ examId: ExamSocket.examId }).then(function() {
            ExamSocket.startHeartBeat();
        }, function() {
            if (ExamSocket.state !== 'stop') {
                ExamSocket.reOpen();
            }
        });
    },
    onMessage: function(msg) {
        if (msg === 'submitPaper' && ExamSocket.callbacks.submitPaper) {
            ExamSocket.callbacks.submitPaper();
        } else if (msg && msg.indexOf('timeExpand_') !== -1  && ExamSocket.callbacks.timeExpand) {
            ExamSocket.callbacks.timeExpand(msg.substring(11));
        }else if (msg && msg.indexOf('joined:') !== -1) {
            ExamSocket.requests[msg.substring(7)].resolve();
            delete ExamSocket.requests[msg.substring(7)];
        }
    },
    onClose: function() {
        if (ExamSocket.state !== 'stop') {
            ExamSocket.reOpen();
        }
    },
    createSocket: function(url, callbacks) {
        var socket = new WS(url);
        socket.onopen = function() {
            if (callbacks && callbacks.onMessage) {
                callbacks.onOpen();
            }
        };
        socket.onmessage = function(e) {
            if (e.data === 'PANG') {
                return;
            }
            if (callbacks && callbacks.onMessage) {
                callbacks.onMessage(e.data);
            }
        };
        socket.onclose = function(e) {
            if (callbacks && callbacks.onClose) {
                callbacks.onClose(e);
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
            if (delta > 45000) {
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
