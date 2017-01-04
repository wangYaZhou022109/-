var D = require('drizzlejs'),
    $ = require('jquery'),
    _ = require('lodash/collection');

exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    btns: function(data) {
        if (!data.state.buttons) return [];

        return data.state.buttons.map(function(v, k) {
            return { id: k, text: v.text };
        });
    }
};

exports.events = {
    'click btn-*': 'buttonClicked',
    'click close': 'closeIt'
};

exports.handlers = {
    buttonClicked: function(id) {
        var button = this.bindings.state.data.buttons[id],
            view = this.module.renderOptions.options.view,
            el, form, data, i, item, name, value, v, actions, callbacks;

        el = view._getElement();    // eslint-disable-line no-underscore-dangle
        form = el.querySelector('form');
        data = {};

        _.map($(form).serializeArray(), function(ii) {
            data[ii.name] = ii.value;
        });

        el = el.querySelectorAll('[data-name][data-value]');
        for (i = 0; i < el.length; i++) {
            item = el[i];
            name = item.getAttribute('data-name');
            value = item.getAttribute('data-value');
            v = data[name];

            if (D.isArray(v)) {
                v.push(value);
            } else {
                data[name] = v == null ? value : [v, value];
            }
        }

        if (!button.action) {
            return this.chain(button.fn && button.fn.call(view, data), function(result) {
                result !== false && this.module.close();
            });
        }

        if (!(view instanceof D.ActionCreator)) {
            throw new Error('Target is not an action creator!');
        }

        actions = view.options.dataForActions || {};
        callbacks = view.options.actionCallbacks || {};
        return this.chain(
            actions[button.action] ? actions[button.action].call(view, data) : data,
            [function(result) {
                return result !== false && view.module.dispatch(button.action, result);
            }, function(result) {
                result !== false && button.closed !== false && this.module.close();
            }],
            function(result) {
                var r = result[0];
                r !== false && callbacks[button.action] && callbacks[button.action].call(view, r);
            }
        );
    },

    closeIt: function() {
        this.module.close();
    }
};
