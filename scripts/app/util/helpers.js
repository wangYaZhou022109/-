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
    toTimeString = function(value, unit) {
        var d, hour, min, sec;
        d = new Date(value);
        hour = d.getHours() + '';
        min = d.getMinutes() + '';
        sec = d.getSeconds() + '';
        hour = hour.length === 1 ? '0' + hour : hour;
        min = min.length === 1 ? '0' + min : min;
        sec = sec.length === 1 ? '0' + sec : sec;
        if (unit === 'minute') {
            return [hour, min].join(':');
        }
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
    monthDay: function(value) {
        var v = value,
            arr = [];
        if (!v) return '';
        v = toDateString(value);
        arr = v.split('-');
        return arr[1] + '-' + arr[2];
    },
    dateTime: function(value) {
        if (!value) return '';
        return toDateString(value) + ' ' + toTimeString(value);
    },

    dateMinute: function(value) {
        var v = value;
        if (!v) return '';
        v = Number(new Date(value).getTime());
        return toDateString(v) + ' ' + toTimeString(v, 'minute');
    },
    // value: yyyy-MM
    firstDay: function(value) {
        var v = value;
        if (!v) return '';
        v = Number(new Date(value).getTime());
        return toDateString(v);
    },
    // value: yyyy-MM
    lastDay: function(value) {
        var v = value,
            tempDate;
        if (!v) return '';
        tempDate = new Date(value);
        tempDate.setMonth(tempDate.getMonth() + 1);
        tempDate = tempDate.getTime() - (1000 * 60 * 60 * 24);
        return toDateString(tempDate);
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

    restoreNumber: function(value, n) {
        if (value && n) return value / n;
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

    downloadUrl: function(fileId, options) {
        var Self = arguments[arguments.length - 1].data.root.Self,
            rootPath = Self.app.options.urlRoot,
            url = rootPath + '/human/file/download?id=' + fileId;
        return fileId && url;
    },

    routerLink: function() {
        var Self = arguments[arguments.length - 1].data.root.Self,
            prefix = Self.app.options.routerPrefix,
            i,
            uri = prefix;
        for (i = 0; i < arguments.length - 1; i++) {
            uri += arguments[i];
        }
        return uri;
    },
    // 修改样式 keeley
    secondToMinute: function(time) {
        var parseInt = window.parseInt;
        var second = time;
        var min = 0; // 分
        var hour = 0; // 小时
        var supple = function(str) {
            if (str <= 9) return '0' + str;
            return str;
        };
        if (!time) return '-';
        if (time > 60) {
            second = parseInt(time % 60);
            min = parseInt(time / 60);
            if (min > 60) {
                min = parseInt(time / 60) % 60;
                hour = parseInt(parseInt(time / 60) / 60);
            }
        }
        return supple(hour) + ':' + supple(min) + ':' + supple(second);
    }
};
