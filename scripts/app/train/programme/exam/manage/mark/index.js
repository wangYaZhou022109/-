
exports.items = {
    main: 'main',
    'mark-config': 'mark-config'
};

exports.store = {
    models: {
        state: {},
        exam: {},
        markConfig: {
            mixin: {
                save: function(data) {
                    this.data.value = data;
                }
            },
            data: { value: '' }
        },
        form: {
            data: {},
            url: '../exam/mark-config'
        }
    },
    callbacks: {
        init: function(payload) {
            this.models.form.data.examId = payload.exam.id;
            this.models.exam.set(payload.exam);
            this.models.markConfig.set(payload.exam.markConfigs);
        },
        save: function() {
            var me = this;
            this.models.form.data = {
                examId: this.models.exam.data.id,
                value: this.models.markConfig.data.value
            };
            return this.save(this.models.form).then(function() {
                var updateMarkConfig = me.module.renderOptions.callback.updateMarkConfig;
                me.app.message.success('操作成功');
                if (updateMarkConfig) updateMarkConfig(me.models.markConfig.data.value);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

