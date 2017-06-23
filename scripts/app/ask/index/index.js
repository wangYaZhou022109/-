// var $ = require('jquery');

// $(window).scroll(function() {
//     if ($(window).scrollTop() + $(window).height() === $(document).height()) {
//         console.log('index!');
//         console.log($(window).scrollTop());
//         console.log($(window).height());
//         console.log($(document).height());
//     }
// });

exports.items = {
    left: 'left',
    topicbanner: 'topicbanner',
    top: 'top',
    middle: 'middle',
    bottom: 'bottom'
};

exports.store = {
    models: {
        topic: { url: '../ask-bar/topic/topic-recommendation' },
        down: { url: '../human/file/download' },
        follow: { url: '../ask-bar/question-details/boutique' },
        unfollow: { url: '../ask-bar/concern/unfollow' },
        leftstate: { },
        topstate: {},
        middlestate: {},
        bottomstate: {}
    },
    callbacks: {
        refresh: function() {
            this.models.middlestate.changed();
        },
        leftrefresh: function() {
            this.models.leftstate.changed();
        },
        bottomsrefresh: function() {
            this.models.bottomstate.changed();
        },
        init: function() {
            var topic = this.models.topic;
            topic.set({ size: 5 });
            return this.post(topic);
        },
        follow: function(payload) {
            var follow = this.models.follow;
            follow.set(payload);
            return this.post(follow);
        },
        unfollow: function(payload) {
            var follow = this.models.unfollow;
            follow.set(payload);
            return this.put(follow);
        },
    }
};


exports.afterRender = function() {
    this.dispatch('init');
};
