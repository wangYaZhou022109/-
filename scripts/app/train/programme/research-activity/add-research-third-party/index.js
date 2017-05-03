var strings = require('./app/util/strings'),
    D = require('drizzlejs'),
    titleType = {
        add: '新增',
        edit: '编辑'
    },
    EXAM_SOURCE_TYPE = 1;
exports.RESEARCH_TYPE = 2;

exports.items = {
    main: 'main'
};

exports.large = true;

exports.title = function() {
    return titleType[this.renderOptions.titleType];
};

exports.store = {
    models: {
        research: {
            url: '../exam/research-activity'
        },
        form: {
            url: '../exam/research-activity/insert-of-other-module'
        }
    },
    callbacks: {
        init: function(payload) {
            if (payload.researchId) {
                this.models.research.set({
                    id: payload.researchId,
                    sourceType: payload.sourceType || EXAM_SOURCE_TYPE
                });
                return this.get(this.models.research);
            }

            D.assign(this.models.research.data, {
                sourceType: payload.sourceType || EXAM_SOURCE_TYPE
            });
            return '';
        },
        save: function(payload) {
            var me = this,
                right,
                validate = payload.validate;
            if (validate) {
                this.models.form.set(D.assign(payload, {
                    sourceType: this.models.research.data.sourceType
                }));
                right = me.save(me.models.form).then(function() {
                    var callback = me.module.renderOptions.callback,
                        data = me.models.form.data;
                    data.startTime = payload.startTime;
                    data.endTime = payload.endTime;
                    if (callback) callback(data);
                    me.models.research.clear();
                    me.app.message.success('保存成功！');
                });
            } else {
                right = false;
            }
            return right;
        },
        changeInfoDetaile: function(payload) {
            var main = this.module.items.main.getEntities()[0];
            D.assign(this.models.research.data, payload, main.getData());
            this.models.research.changed();
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.buttons = [{
    text: strings.get('ok'),
    fn: function() {
        var view = this.items.main.getEntities()[0],
            me = this;
        return me.dispatch('save', D.assign(
            me.items.main.getData(),
            {
                dimensions: JSON.stringify(view.getData().dimensions),
                id: this.store.models.research.data.id,
                type: this.module.options.RESEARCH_TYPE,
                validate: this.items.main.validate(),
            }
        ));
    }
}];