var $ = require('jquery');
exports.items = {
    details: 'details'
};

exports.store = {
    models: {
        state: {},
        report: { url: '../ask-bar/accuse-record/report' }
    },
    callbacks: {
        init: function(payload) {
            this.models.state.id = payload.id;
            this.models.state.objectType = payload.objectType;
            this.models.state.beUserId = payload.beUserId;
        },
        report: function(payload) {
            var report = this.models.report;
            var data = payload;
            data.id = this.models.state.id;
            data.objectType = this.models.state.objectType;
            data.beUserId = this.models.state.beUserId;
            report.set(data);
            return this.save(report).then(function() {
                this.app.message.success('举报成功，等待管理员处理');
            });
        }

    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.title = '举报';
exports.buttons = [{
    text: '提交',
    fn: function(payload) {
        var data = payload;
        if (!data.type) {
            this.app.message.error('请选择举报类型');
            return false;
        }
        data.accuseNote = $.trim(data.accuseNote);
        return this.dispatch('report', data);
    }
}];

exports.small = true;
