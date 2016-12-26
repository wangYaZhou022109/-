var time = 1000;

exports.bindings = {
    state: true
};

exports.afterRender = function() {
    var duration = this.bindings.state.data.duration,
        el = this.$('time'),
        hour,
        minitus,
        second,
        getStr = function() {
            var h = hour.toString().length === 1 ? '0' + hour : hour,
                m = minitus.toString().length === 1 ? '0' + minitus : minitus,
                s = second.toString().length === 1 ? '0' + second : second;
            return [h, m, s].join(':');
        },
        callback = this.bindings.state.callback,
        si;
    hour = Math.floor(duration / 60);
    duration %= 60;
    minitus = duration < 1 ? 0 : duration;
    second = duration < 1 ? (duration % 60) * 60 : 0;
    el.innerHTML = getStr();
    si = setInterval(function() {
        if (second === 0) {
            if (minitus === 0) {
                if (hour === 0) {
                    clearInterval(si);
                    if (callback) callback();
                    return;
                }
                hour -= 1;
                minitus = 59;
                second = 59;
                el.innerHTML = getStr();
                return;
            }
            minitus -= 1;
            second = 59;
            el.innerHTML = getStr();
            return;
        }
        second -= 1;
        el.innerHTML = getStr();
    }, time);
};
