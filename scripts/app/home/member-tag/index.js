var _ = require('lodash/collection'),
    D = require('drizzlejs');
exports.items = {
    main: 'main'
};

exports.title = '  ';

exports.closeText = '跳过，直接进入首页';

exports.closeAction = function(module) {
    return module.dispatch('skipSetting');
};

exports.buttons = [{
    text: '确定',
    fn: function() {
        var selectedTopics = this.store.models.selectedTopics.data || [],
            topicIds = [];
        if (selectedTopics.length === 0) {
            this.app.message.error('请选择标签！');
            return false;
        }
        topicIds = _.map(selectedTopics, 'id');
        return this.dispatch('save', { topicIds: topicIds.join(',') });
    }
}];
exports.store = {
    models: {
        topics: { url: '../system/topic/select', params: { group: 1, recommend: 1 } },
        selectedTopics: { data: [] },
        memberSetting: { url: '../human/member/init-setting' },
        memberTopic: { url: '../human/member/topic' }
    },
    callbacks: {
        refreshTopics: function() {
            var topics = this.models.topics,
                topicResult;
            return this.get(topics).then(function(data) {
                if (data && D.isArray(data) && data.length > 0) {
                    topicResult = data[0];
                    // 不足20个，不能换一批，提示没有更多标签了
                    topics.set({ enough: topicResult.length < 20 });
                    topics.set(_.sampleSize(topicResult, 20), true);
                }
            });
        },
        selected: function(payload) {
            var selectedTopics = this.models.selectedTopics;
            selectedTopics.data.push(payload);
            selectedTopics.changed();
            return true;
        },
        cancelSelected: function(payload) {
            var selectedTopics = this.models.selectedTopics,
                datas = _.reject(selectedTopics.data, ['id', payload.id]);
            selectedTopics.set(datas);
            selectedTopics.changed();
            return true;
        },
        skipSetting: function() {
            var memberId = this.app.global.currentUser.id,
                memberSetting = this.models.memberSetting,
                me = this;
            memberSetting.set({ memberId: memberId });
            return this.post(memberSetting).then(function() {
                D.assign(me.app.global.currentUser, { initSetting: 1 });
                return true;
            });
        },
        save: function(payload) {
            var memberTopic = this.models.memberTopic,
                memberSetting = this.models.memberSetting,
                memberId = this.app.global.currentUser.id,
                me = this;
            D.assign(payload, { memberId: memberId });
            memberTopic.set(payload);
            return this.post(memberTopic).then(function() {
                memberSetting.set({ memberId: memberId });
                return me.post(memberSetting).then(function() {
                    D.assign(me.app.global.currentUser, { initSetting: 1 });
                    return true;
                });
            });
        }
    }
};

exports.afterRender = function() {
    this.dispatch('refreshTopics');
};
