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
   // right: 'right'
    top: 'top',
    middle: 'middle',
    bottom: 'bottom'
};

exports.store = {
    models: {
        leftstate: { },
        topstate: {},
        middlestate: {},
        bottomstate: {}
    },
    callbacks: {
        refresh: function() {
            this.models.middlestate.changed();
        }
    }
};


exports.afterRender = function() {
};
