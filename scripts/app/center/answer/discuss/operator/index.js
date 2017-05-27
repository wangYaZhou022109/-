var _ = require('lodash/collection');
exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        answer: {},
        discuss: { url: '../ask-bar/answer-discuss' },
        praise: { url: '../ask-bar/my-share/praise' },
        unpraise: { url: '../ask-bar/my-share/unpraise' },
        speech: {}
    },
    callbacks: {
        publish: function(payload) {
            var discuss = this.models.discuss,
                answer = this.models.answer,
                speechset = _.find(this.models.speech.data, { code: 'bar_discuss' }),
                data = payload;
            data.speechset = speechset.status;
            data.id = answer.data.id;
            data.organizationId = this.app.global.currentUser.organization.id;
            discuss.set(data);
            return this.save(discuss).then(function() {
                answer.data.discussNum = (answer.data.discussNum || 0) + 1;
                answer.changed();
            });
        },
        praise: function() {
            var praise = this.models.praise,
                answer = this.models.answer;
            praise.set({ id: answer.data.id, objectType: answer.data.objectType });
            answer.data.praise = true;
            answer.data.praiseNum = (answer.data.praiseNum || 0) + 1;
            answer.changed();
            return this.post(praise);
        },
        unpraise: function() {
            var unpraise = this.models.unpraise,
                answer = this.models.answer;
            unpraise.set({ id: answer.data.id, objectType: answer.data.objectType });
            answer.data.praise = false;
            answer.data.praiseNum = (answer.data.praiseNum || 0) - 1;
            answer.changed();
            return this.put(unpraise);
        }
    }
};

exports.beforeRender = function() {
    var answer = this.renderOptions.answer;
    // if (answer.concern.id) {
    //     answer.follow = true;
    // }
    this.store.models.answer.set(answer);
    this.store.models.speech.set(this.renderOptions.speech);
};
