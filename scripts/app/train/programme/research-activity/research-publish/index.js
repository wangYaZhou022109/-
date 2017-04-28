exports.title = '通知';

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        state: {},
        publishResearch: {
            url: '../exam/research-activity/publish'
        }
    },
    callbacks: {
        init: function(payload) {
            this.models.state.set({
                id: payload.id,
                noticeTemplate: '您好，XXX 于 2016-04-05 23:45 发布了《调研名称》邀请来调研。',
                researchUrl: 'https://zxy9.zhixueyun.com/#/exam/research-activity/index/' + payload.id
            });
        },
        publishResearch: function() {
            var me = this;
            this.models.publishResearch.set({
                id: this.models.state.data.id
            });
            return this.put(this.models.publishResearch).then(function() {
                me.app.message.success('发布成功');
                me.module.renderOptions.callback();
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.buttons = [{
    text: '确定',
    fn: function() {
        return this.dispatch('publishResearch');
    }
}];
