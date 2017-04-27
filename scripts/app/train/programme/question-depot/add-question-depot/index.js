var D = require('drizzlejs'),
    // strings = require('./app/util/strings'),
    titleType = {
        add: '新增题库',
        edit: '修改题库'
    };

exports.items = {
    main: 'main'
};

exports.title = function() {
    return titleType[this.renderOptions.titleType];
};

exports.store = {
    models: {
        state: {},
        questionDepot: {
            url: '../exam/question-depot'
        }
    },
    callbacks: {
        init: function(payload) {
            this.models.questionDepot.clear();

            if (payload.organizationId) {
                this.models.state.set({ organizationId: payload.organizationId });
            }

            if (payload.questionDepotId) {
                this.models.questionDepot.set({ id: payload.questionDepotId });
                return this.get(this.models.questionDepot);
            }

            return '';
        },
        saveQuestionDepot: function(payload) {
            var me = this;
            if (payload.validate) {
                this.models.questionDepot.set(D.assign(payload, {
                    organizationId: this.models.state.data.organizationId || ''
                }));
                return this.save(this.models.questionDepot).then(function() {
                    me.module.renderOptions.callback();
                    me.app.message.success('保存成功');
                });
            }
            return false;
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.buttons = [{
    text: '保存',
    fn: function(payload) {
        return this.dispatch('saveQuestionDepot', D.assign(payload, { validate: this.items.main.validate() }));
    }
}];

