exports.bindings = {
    state: true
};

exports.type = 'dynamic';

exports.getEntity = function() {
};

exports.getEntityModuleName = function(menu) {
    return 'home/message/wait/' + menu;
};

exports.dataForEntityModule = function() {
    return {
        callback: function() {
        }
    };
};
