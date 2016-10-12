var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    A = require('../../util/animation');

exports.items = {
    header: 'header',
    footer: 'footer'
};

exports.store = {
    models: {
        state: { data: {} }
    },

    callbacks: {
        init: function(payload) {
            var d,
                title = payload.title;
            if (D.isFunction(title)) title = title.call(this.module.renderOptions.view);

            d = {
                title: title,
                closeText: payload.closeText || '关闭',
                buttons: {}
            };
            _.map(payload.buttons, function(item, i) {
                d.buttons[i] = { text: item.text, fn: item.fn, action: item.action, closed: item.closed };
            });
            this.models.state.set(d, true);
        }
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

exports.mixin = {
    animateIn: 'fadeInRightBig',
    animateOut: 'bounceOutRight',
    closed: true,
    close: function() {
        var me = this;
        A.animate(this.$('animate'), this.animateOut, function() {
            me._region.close(); // eslint-disable-line no-underscore-dangle
            me.closed = true;
        });
    }
};

exports.afterRender = function() {
    var promise = this.regions.content.show(this.renderOptions.view, this.renderOptions.options);
    A.animate(this.$('animate'), this.animateIn, function() {
        promise.then(function(v) {
            var el = v.$$('input')[0];
            el && el.focus();
        });
    });
    if (this.renderOptions.view.options.large) {
        this.$('animate').className += ' large';
    }
    if (this.renderOptions.view.options.smaill) {
        this.$('animate').className += ' smaill';
    }
    return this.dispatch('init', this.renderOptions.view.options);
};
