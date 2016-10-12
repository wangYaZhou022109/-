exports.items = {
    'main/top': { region: 'top', isModule: true },
    'main/bottom': { region: 'bottom', isModule: true }
};

exports.mixin = {
    popup: function(view, options) {
        var me = this;
        if (!me.current_popup || me.current_popup.closed) {
            return me.regions.popup.show('main/popup', { view: view, options: options }).then(function(x) {
                var current = x || {};
                current.closed = false;
                me.current_popup = current;
                return current;
            });
        }
        return this.Promise.resolve(null);
    },
    closePopup: function() {
        return this.current_popup.close();
    },
    modal: function(view, options) {
        var me = this;
        if (!me.current_modal || me.current_modal.closed) {
            return me.regions.modal.show('main/modal', { view: view, options: options }).then(function(x) {
                var current = x || {};
                current.closed = false;
                me.current_modal = current;
                return current;
            });
        }
        return this.Promise.resolve(null);
    },
    closeModal: function() {
        this.current_modal.close();
    },
    ground: function(view, options) {
        var me = this;
        if (!me.current_ground || me.current_ground.closed) {
            return this.regions.ground.show('main/ground', { view: view, options: options }).then(function(x) {
                var current = x || {};
                current.closed = false;
                me.current_ground = current;
                return current;
            });
        }
        return this.Promise.resolve(null);
    },
    closeGround: function() {
        this.current_groud.close();
    }
};
