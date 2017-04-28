var D = require('drizzlejs');

exports.items = {
    info: 'info',
    menu: 'menu',
    content: 'content',
    'change-time': ''
};

exports.title = '考试管理';

exports.store = {
    models: {
        exam: {
            url: '../exam/exam',
            mixin: {
                updateMarkConfig: function(data) {
                    this.data.markConfigs = data;
                }
            }
        },
        download: { url: '../human/file/download' },
        state: {},
        changeTime: { url: '../exam/exam/change-time' }
    },
    callbacks: {
        init: function(payload) {
            var me = this;
            this.models.exam.set(payload);
            return this.get(this.models.exam).then(function(data) {
                if (data[0].type === 1) {
                    me.models.state.data.menuId = 1;
                } else {
                    me.models.state.data.menuId = 2;
                }
            });
        },
        refresh: function() {
            return this.get(this.models.exam);
        },
        refreshState: function() {
            this.models.state.changed();
        },
        changeTime: function(payload) {
            var me = this;
            D.assign(payload, {
                id: this.models.exam.data.id
            });
            this.models.changeTime.set(payload);
            return this.put(this.models.changeTime).then(function() {
                me.app.message.success('变更时间成功');
                return me.get(me.models.exam);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { id: this.renderOptions.id });
};
