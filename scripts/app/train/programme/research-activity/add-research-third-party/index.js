var strings = require('./app/util/strings'),
    D = require('drizzlejs'),
    titleType = {
        add: '新增调研',
        edit: '编辑调研'
    },
    RESEARCH_ACTIVITY_TYPE = 1;

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
                this.models.research.set({ id: payload.researchId });
                return this.get(this.models.research);
            }
            return '';
        },
        save: function(payload) {
            var me = this;
            this.models.form.set(payload);
            return this.save(this.models.form).then(function() {
                var callback = me.module.renderOptions.callback;
                if (callback) callback(me.models.form.data);
                me.app.message.success(strings.get('save-success'));
            });
        },
        changeInfo: function(payload) {
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
        var view = this.items.main.getEntities()[0];
        return this.dispatch('save', D.assign(
            this.items.main.getData(),
            {
                dimensions: JSON.stringify(view.getData().dimensions),
                id: this.store.models.research.data.id,
                type: RESEARCH_ACTIVITY_TYPE
            }
        ));
    }
}];
