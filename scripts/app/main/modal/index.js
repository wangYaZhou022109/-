var A = require('../../util/animation'),
    D = require('drizzlejs');

exports.items = {
    title: 'title',
    buttons: 'buttons'
};

exports.store = {
    models: {
        state: {}
    },

    callbacks: {
        init: function(payload) {
            var view = payload.view,
                title = payload.title || view.options.title,
                buttons = view.options.buttons;

            if (D.isFunction(title)) title = title.call(view);
            if (D.isFunction(buttons)) buttons = buttons.call(view);

            buttons = buttons && buttons.map(function(item) {
                return { text: item.text, fn: item.fn, action: item.action, closed: item.closed };
            });

            this.models.state.set({
                title: title,
                buttons: buttons,
                closeText: view.options.closeText || '关闭'
            }, true);
        }
    }
};

exports.mixin = {
    close: function() {
        var me = this;
        return this.Promise.create(function(resolve) {
            A.animate(me.$('animate'), me.renderOptions.options.animation.OUT, function() {
                me.chain(me.app.viewport.regions.modal.pop(), function() {
                    resolve();
                });
            });
        });
    }
};

exports.events = {
    'click dismiss': 'close'
};

exports.handlers = {
    close: function() {
        this.close();
    }
};

exports.beforeRender = function() {
    this.renderOptions.options.view.off('module.main.view.rendered');
};

exports.afterClose = function() {
    this.renderOptions.options.view.off('module.main.view.rendered');
};

exports.afterRender = function() {
    var options = this.renderOptions.options,
        view = options.view,
        me = this,
        promise;

    promise = this.regions.content.show(view, options);
    A.animate(this.$('animate'), options.animation.IN, function() {
        promise.then(function(v) {
            var el = v.$$('input')[0];
            el && el.focus();
        });
    });
    return this.chain(promise, function() {
        this.dispatch('init', options);
    }, function() {
        view.on('module.main.view.rendered', function() {
            me.dispatch('init', options);
        });
    });
};
