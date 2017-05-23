var _ = require('lodash/collection');
exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        question: {},
        discuss: { url: '../ask-bar/question-discuss' },
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        speech: {}
    },
    callbacks: {
        changeFollow: function() {
            var question = this.models.question,
                model = this.models.follow;
            model.set({ id: question.data.id, concernType: 2 });
            if (question.data.follow) {
                model = this.models.unfollow;
                model.set({ id: question.data.id, concernType: 2 });
                return this.put(model).then(function() {
                    delete question.data.follow;
                    question.changed();
                });
            }
            return this.post(model).then(function() {
                question.data.follow = true;
                question.changed();
            });
        },
        publish: function(payload) {
            var discuss = this.models.discuss,
                question = this.models.question,
                speechset = _.find(this.models.speech.data, { code: 'bar_discuss' }),
                data = payload;
            data.speechset = speechset.status;
            data.id = question.data.id;
            data.organizationId = this.app.global.currentUser.organization.id;
            discuss.set(data);
            return this.save(discuss).then(function() {
                question.data.discussNum = (question.data.discussNum || 0) + 1;
                question.changed();
            });
        }
    }
};

exports.beforeRender = function() {
    var question = this.renderOptions.question;
    if (question.concern.id) {
        question.follow = true;
    }
    this.store.models.question.set(question);
    this.store.models.speech.set(this.renderOptions.speech);
};
