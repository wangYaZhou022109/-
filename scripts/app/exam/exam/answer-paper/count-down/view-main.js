var time = 1000,
    _ = require('lodash/collection');

exports.bindings = {
    state: true
};

exports.afterRender = function() {
    var duration = this.bindings.state.data.duration,
        callback = this.bindings.state.callback,
        el = this.$('time'),
        hms,
        hour,
        minitus,
        second,
        si,

        changeMinsToHMS = function(mins) {
            var minss = mins,
                h,
                m,
                s;

            h = Math.floor(minss / 60);
            minss %= 60;
            m = Math.floor(minss);
            s = minss === 0
                ? 0 : Math.floor(Number(minss.toFixed(2).toString().split('.')[1] / 100) * 60);

            return { hour: h, minitus: m, second: s };
        },

        getTimeStr = function(h, m, s) {
            var hh = h.toString().length === 1 ? '0' + h : h,
                mm = m.toString().length === 1 ? '0' + m : m,
                ss = s.toString().length === 1 ? '0' + s : s;
            return [hh, mm, ss].join(':');
        },

        doSomeInCountDown = function(str) {
            var remainTimeTodos = callback;
            _.forEach(remainTimeTodos, function(d) {
                var obj = changeMinsToHMS(d.time);
                if (getTimeStr(obj.hour, obj.minitus, obj.second) === str) {
                    d.doing();
                }
            });
            return str;
        };

    hms = changeMinsToHMS(duration);
    hour = hms.hour;
    minitus = hms.minitus;
    second = hms.second;

    el.innerHTML = doSomeInCountDown(getTimeStr(hour, minitus, second));

    si = setInterval(function() {
        if (second === 0) {
            if (minitus === 0) {
                if (hour === 0) {
                    clearInterval(si);
                    return;
                }
                hour -= 1;
                minitus = 59;
                second = 59;
                el.innerHTML = doSomeInCountDown(getTimeStr(hour, minitus, second));
                return;
            }
            minitus -= 1;
            second = 59;
            el.innerHTML = doSomeInCountDown(getTimeStr(hour, minitus, second));
            return;
        }
        second -= 1;
        el.innerHTML = doSomeInCountDown(getTimeStr(hour, minitus, second));
    }, time);
    return this.module.dispatch('setInterval', { si: si });
};
