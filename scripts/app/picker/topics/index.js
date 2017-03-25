var D = require('drizzlejs'),
    _ = require('lodash/collection');
exports.items = {
    main: 'main',
    tags: 'tags',
    'picker/topics/select-topic': { isModule: true }
};

exports.store = {
    models: {
        state: {},
        hot: { url: '../system/topic/hot' },
        topic: { url: '../system/topic/quick-add' }
    },
    callbacks: {
        init: function(payload) {
            this.models.state.set(payload);
            this.models.hot.params = { type: payload.hotType, limit: payload.hotsize };
            this.get(this.models.hot);
        },
        'quick-add': function(payload) {
            this.models.topic.set(payload);
            return this.post(this.models.topic);
        },
        'change-hot': function(payload) {
            var hot = this.models.hot;
            _.forEach(hot.data, function(h) {
                var temp = h || {};
                temp.selected = payload.indexOf(h.id) !== -1;
            });
            hot.changed();
        }
    }
};

exports.mixin = {
    getValue: function() {
        return this.items.tags.components.tags.getValue();
    },
    getData: function() {
        return this.items.tags.components.tags.getData();
    },
    validate: function() {
        return this.items.tags.validate();
    }
};
exports.beforeRender = function() {
    var limit = this.renderOptions.limit || 3;
    var opt = {
        hotsize: 4, // 显示大小
        hotType: 4, // type 类型（1人  2课程   3考试  4知识  5专题  6问题  7专家  8直播  9MOOC  10调研）
        insertTypeName: '其他', // 快速添加的时候 类型名称
        limit: limit,
        placeholder: '输入标签名按回车即可添加,最多添加' + limit + '个'
    };
    D.assign(opt, this.renderOptions);
    this.dispatch('init', opt);
};
