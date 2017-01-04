var push, pop;

push = function(mod, type, view, options) {
    var me = mod;
    if (me.busy) return me.Promise.reject();
    me.busy = true;

    setTimeout(function() { me.busy = false; }, 1000);

    return me.regions.modal.push(view, options, type).then(function() {
        me.busy = false;
    });
};

pop = function(mod) {
    var me = mod;
    if (me.busy) return me.Promise.reject();
    me.busy = true;

    setTimeout(function() { me.busy = false; }, 1000);

    return me.regions.modal.pop().then(function() {
        me.busy = false;
    });
};

exports.items = {
    'home/default/top': { region: 'top', isModule: true },
    'home/default/bottom': { region: 'bottom', isModule: true }
};

exports.mixin = {
    popup: function(view, options) {
        return push(this, 'popup', view, options);
    },
    closePopup: function() {
        return pop(this);
    },

    modal: function(view, options) {
        return push(this, 'modal', view, options);
    },
    closeModal: function() {
        return pop(this);
    },

    ground: function(view, options) {
        return push(this, 'ground', view, options);
    },
    closeGround: function() {
        return pop(this);
    }
};
