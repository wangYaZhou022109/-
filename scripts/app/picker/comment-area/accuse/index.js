var $ = require('jquery');
exports.items = {
    details: 'details'
};

exports.store = {
    models: {
        state: {},
        accuse: { url: '../system/comment-accuse/save' }
    },
    callbacks: {
        init: function(payload) {
            this.models.state.id = payload.id;
            this.models.state.objectType = payload.objectType;
            this.models.state.beUserId = payload.beUserId;
            this.models.state.sourceTitle = payload.sourceTitle;
            this.models.state.content = payload.content;
            this.models.state.sourceType = payload.sourceType;
            this.models.state.sourceId = payload.sourceId;
        },
        report: function(payload) {
            var accuse = this.models.accuse;
            var data = payload;
            data.id = this.models.state.id;
            data.objectType = this.models.state.objectType;
            data.beUserId = this.models.state.beUserId;
            data.sourceTitle = this.models.state.sourceTitle;
            data.content = this.models.state.content;
            data.sourceType = this.models.state.sourceType;
            data.sourceId = this.models.state.sourceId;
            accuse.set(data);
            return this.save(accuse).then(function() {
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
        } else if (data.accuseNote.length > 1000) {
            this.app.message.error('举报理由,最长不超过1000个字符');
            return false;
        }
        data.accuseNote = $.trim(data.accuseNote);
        return this.dispatch('report', data);
    }
}];

exports.small = true;
