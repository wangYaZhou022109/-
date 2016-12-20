var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    validators = require('./validators'),
    markers = require('./markers'),
    $ = require('jquery'),
    FromView;

var doValidate = function(value, rule) {
    var validator = validators[rule.shift()],
        message = rule.length > validator.length ? rule.pop() : validator.message,
        i;

    if (!validator.fn.apply(null, [value].concat(rule))) {
        for (i = 0; i < validator.length; i++) {
            message = message.replace(new RegExp('\\{' + i + '\\}', 'g'), rule[i]);
        }
        return message;
    }
    return true;
};

var validateEl = function(el, view) {
    var rules = el.getAttribute('x-rule').split(','),
        marker = markers[el.getAttribute('x-marker')] || markers.text,
        target = el.getAttribute('x-target'),
        value = target ? view.components[target].getValue() : $(el).val(),
        result;

    result = _.map(rules, function(rule) {
        return doValidate(value, rule.split(':'));
    });

    result = _.filter(result, function(item) { return item !== true; });
    if (!result.length) {
        marker.valid($(el));
        return true;
    }

    marker.invalid($(el), result.join(','));
    return false;
};

FromView = function(name, app, mod, loader, options) {
    // eslint-disable-next-line no-underscore-dangle
    FromView.__super__.constructor.call(this, name, app, mod, loader, D.assign({}, options, {
        mixin: {
            validate: function(el) {
                var me = this;
                if (el) return validateEl(el);
                return _.every(_.map(this.$$('.input[x-rule]'), function(item) {
                    return validateEl(item, me);
                }));
            },

            // eslint-disable-next-line no-underscore-dangle
            _bindEvents: function(su) {
                su.call(this);

                // eslint-disable-next-line no-underscore-dangle
                this._region._delegateDomEvent(this, 'focusout', '.input[x-rule]', function(e, t) {
                    this.validate(t);
                });
            }
        },
    }));
};

D.extend(FromView, D.View);

D.registerView('form', FromView);
