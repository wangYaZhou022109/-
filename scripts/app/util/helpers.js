var maps, D, strings,
    operators = {
        eq: function(r, l) { return r === l; },
        gt: function(r, l) { return r > l; },
        lt: function(r, l) { return r < l; },
        ge: function(r, l) { return r >= l; },
        le: function(r, l) { return r <= l; },
        ne: function(r, l) { return r !== l; }
    },
    toDateString = function(value) {
        var d, year, month, date;
        d = new Date(value);
        year = d.getFullYear() + '';
        month = (d.getMonth() + 1) + '';
        date = d.getDate() + '';
        month = month.length === 1 ? '0' + month : month;
        date = date.length === 1 ? '0' + date : date;
        return [year, month, date].join('-');
    },
    toTimeString = function(value) {
        var d, hour, min, sec;
        d = new Date(value);
        hour = d.getHours() + '';
        min = d.getMinutes() + '';
        sec = d.getSeconds() + '';
        hour = hour.length === 1 ? '0' + hour : hour;
        min = min.length === 1 ? '0' + min : min;
        sec = sec.length === 1 ? '0' + sec : sec;
        return [hour, min, sec].join(':');
    };

maps = require('./maps');
D = require('drizzlejs');
strings = require('./strings');

module.exports = {
    module: function(options) {
        return (this.Self instanceof D.Module) ? options.fn(this) : '';
    },

    view: function(name, options) {
        return (this.Self instanceof D.View) && this.Self.name === name ? options.fn(this) : '';
    },

    map: function(type, value) {
        var o = maps[type];
        return o[value] || '';
    },

    compare: function(value, op, rvalue, options) {
        return operators[op](value, rvalue) ? options.fn(this) : options.inverse(this);
    },

    date: function(value) {
        if (!value) return '';
        return toDateString(value);
    },

    dateTime: function(value) {
        if (!value) return '';
        return toDateString(value) + ' ' + toTimeString(value);
    },

    setting: function(key) {
        var o = window.app.global.setting[key];
        return o || '';
    },

    string: function(key) {
        return strings.get(key);
    },

    percent: function(value) {
        return value + '%';
    },

    restoreNumber: function(value) {
        return value / 100;
    },

    inner: function(data, key, options) {
        var fn = options.fn,
            ret;
        ret = fn(data[key]);
        return ret;
    },

    pick: function(val, def) {
        if (!val) {
            return def;
        }
        return val;
    },

    times: function() {
        /* eslint-disable */
        var fn, ret = [], i, count = 1, start, end, options, that = this;
        if (arguments.length === 2) {
            start = 0;
            end = arguments[0];
            options = arguments[1];
        } else {
            start = arguments[0];
            end = arguments[1];
            options = arguments[2];
        }
        fn = options.fn;

        function execIteration (index) {
            var innerData = D.assign({ count: count, index: index }, that);
            ret.push(fn(innerData));
            count++;
        }
        for (i = start; i < end; i++) {
            execIteration(i);
        }
        return ret.join('');
    },

    isGrant: function(operatorType, organizationId, options) {
        var view = options.data.root.Self,
            grants,
            types;

        if (!view) return '';

        grants = view.module.store.models.Grants;
        if (!grants || !grants.data) return '';

        grants = grants.data;

        if (!organizationId && operatorType === window.app.global.EDIT) {
            if (Object.keys(grants).some(function(k) {
                if (grants[k].indexOf(operatorType) !== -1) return true;
                return false;
            })) {
                return options.fn(this);
            }
        }

        types = grants[organizationId];
        if (types && types.indexOf(operatorType) !== -1) {
            return options.fn(this);
        }
        return '';
    }
};
