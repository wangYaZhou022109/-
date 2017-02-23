var $ = require('jquery'),
    changeToFullScreen;

exports.items = {
    'question-type': 'question-type',
    main: 'main',
    head: 'head'
};

exports.store = {
    models: {
    },
    callbacks: {
        init: function() {
        }
    }
};

exports.beforeRender = function() {
    changeToFullScreen();
};


changeToFullScreen = function() {
    $('.header').hide();
    $('.footer').hide();
    $('.achievement-content').attr('height', '100%');
};
