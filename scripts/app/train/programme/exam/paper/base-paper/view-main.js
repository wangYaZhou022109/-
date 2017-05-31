exports.bindings = {
    state: true,
    types: true
};

exports.type = 'dynamic';

exports.events = {
    'click prev-*': 'prev',
    'click next-*': 'next'
};

exports.handlers = {
    prev: function(id) {
        return this.module.dispatch('move', { id: id, offset: -1 });
    },
    next: function(id) {
        return this.module.dispatch('move', { id: id, offset: 1 });
    }
};
