var _ = require('lodash/collection'),
    D = require('drizzlejs');
exports.items = {
    main: 'main'
};

exports.title = '选择标签';

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
        topics: { url: '../system/topic/select', params: { group: 1 }, autoLoad: 'after' },
        selectedTopics: { data: [] },
        memberSetting: { url: '../human/member/init-setting' },
        memberTopic: { url: '../human/member/topic' }
    },
    callbacks: {
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
                me.app.viewport.closePopup();
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
