
exports.bindings = {
};


exports.actions = {
    'click release': 'release'
};

exports.dataForActions = {
    release: function(payload) {
        return payload;
    }
};

exports.actionCallbacks = {
    release: function() {
        this.app.message.success('操作成功！');
        setTimeout(function() {
            window.location.reload();
        }, 1000);
    }
};


exports.dataForTemplate = {
};
