exports.items = {
    main: 'main',
    'activity/index/exam-prompt': { isModule: true }
};

exports.store = {
    models: {
        classInfo: { url: '../train/class-info/find-my-class-info', autoLoad: 'after' }
    },
    // callback: {
    //     init: function() {

    //     }
    // }
};
