exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        questions: { url: '../ask-bar/myquiz/question' },
        setCareNum: { url: '../ask-bar/question/care-num' },
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        shut: { url: '../ask-bar/question/close-status' },
        discuss: { url: '../ask-bar/question-discuss' },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function() {
            var questions = this.models.questions;
            questions.set({ id: 1 });
            return this.get(questions);
        },
        remove: function(payload) {
            var questions = this.models.questions;
            questions.set(payload);
            return this.get(questions);
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        unfollow: function(payload) {
            var follow = this.models.unfollow;
            // console.log(payload);
            follow.set(payload);
            return this.put(follow);
        },
        shut: function(payload) {
            this.models.shut.set(payload);
            return this.put(this.models.shut);
        },
        publish: function(payload) {
            var discuss = this.models.discuss;
            discuss.set(payload);
            return this.save(discuss);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};

