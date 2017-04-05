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
    main: 'main'
};

exports.store = {
    models: {
        state: { data: { menu: 'content' } }
    },
    callbacks: {
        init: function() {
        }
    }
};


exports.afterRender = function() {
};
