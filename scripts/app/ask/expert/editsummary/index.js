exports.items = {
    editsummary: 'editsummary'
};

exports.store = {
    models: {
        state: { data: [] },
        updateIntroduce: { url: '../ask-bar/expert/updateIntroduce' }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state;
            state.data = payload.expert;
            state.changed();
        },
        updateIntroduce: function(payload) {
            var innerExpert = this.models.updateIntroduce;
            var data = {};
            var me = this;
            data.introduce = payload.introduce;
            data.id = this.models.state.data.id;
            innerExpert.set(data);
            this.save(innerExpert).then(function(result) {
                me.app.message.success('修改成功');
                me.module.module.store.models.expert.set(result[0]);
                me.module.module.dispatch('init');
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};

exports.title = '编辑专家简介';

exports.buttons = [{
    text: '确定',
    fn: function(payload) {
        return this.dispatch('updateIntroduce', payload);
    }
}];
