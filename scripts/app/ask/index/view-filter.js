
exports.bindings = {
    params: true
};

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(el) {
        var isOverdue = el;
        
        if (isOverdue === '1') {
            this.app.show('content', 'ask/index', { isOverdue: isOverdue });
        } else if (isOverdue === '2') {
            this.app.show('content', 'ask/index', { isOverdue: isOverdue });
        } else if (isOverdue === '3') {
            this.app.show('content', 'ask/index', { isOverdue: isOverdue });
        } else {
            this.app.show('content', 'ask/index', { isOverdue: isOverdue });
        }
    }
};
