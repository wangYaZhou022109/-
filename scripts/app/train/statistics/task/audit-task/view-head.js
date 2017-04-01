exports.bindings = {
    all: true,
};

exports.events = {
    'click closeTask': 'closeTask',
};

exports.handlers = {
    closeTask: function() {
        window.close();
    },
};
