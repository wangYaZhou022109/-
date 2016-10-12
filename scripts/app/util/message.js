var alertify = window.alertify,
    confirm;

alertify.set({
    labels: {
        ok: '确定',
        cancel: '取消'
    }
});

confirm = alertify.confirm;

exports.setup = function(app) {
    var root = app;
    root.message = alertify;
    root.message.confirm = function(msg, ok, cancel) {
        confirm.call(alertify, msg, function(e) {
            if (e && ok) ok();
            if (!e && cancel) cancel();
        });
    };
};
