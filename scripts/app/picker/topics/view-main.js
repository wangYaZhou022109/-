var _ = require('lodash/collection'),
    D = require('drizzlejs');
// exports.type = 'form';
exports.bindings = {
    state: false,
    hot: true
};

exports.events = {
    'click selectTopic': 'showTopic',
    'click clearTopic': 'clearTopic',
    'click hot-*': 'addTopic',
};

exports.handlers = {
    showTopic: function() {
        var me = this,
            model = me.module.items['picker/topics/select-topic'],
            comp = this.module.items.tags.components.tags,
            state = this.bindings.state.data,
            params = {
                ids: comp.getValue()
            };
        if (state.group) {
            D.assign(params, {
                group: state.group
            });
        }
        me.app.viewport.modal(model, D.assign(params, {
            callback: function(payload, flag) {
                // 选中添加，非选中取消添加。
                if (flag) {
                    return comp.addItem({
                        value: payload.id,
                        text: payload.name
                    });
                }
                return comp.removeItem(payload.id);
            }
        }));
    },
    addTopic: function(id, e, element) {
        var comp = this.module.items.tags.components.tags;
        var topics = this.bindings.state.data.topics;
        var isExist = false;
        _.forEach(topics, function(obj) {
            var topic = obj || {};
            if (topic.value === id) {
                this.app.message.error('你已选择该话题');
                isExist = true;
            }
        });
        if (isExist) return;
        comp.addItem({
            value: id,
            text: element.innerText
        });
    },
    clearTopic: function() {
        var comp = this.module.items.tags.components.tags;
        comp.clear();
    }
};
