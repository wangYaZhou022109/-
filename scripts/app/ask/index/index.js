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
        trends: { url: '../ask-bar/topic/all-dynamic' },
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
        }
    }
};


exports.afterRender = function() {
};
