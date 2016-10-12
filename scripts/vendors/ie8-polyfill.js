if (!Function.prototype.bind) {
    Function.prototype.bind = function(ctx) {
        var args = Array.prototype.slice.call(arguments, 1),
            me = this,
            FNOP = function() {},
            fBound = function() {
                return me.apply(this instanceof FNOP
                    ? this
                    : ctx,
                    args.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
            FNOP.prototype = this.prototype;
        }
        fBound.prototype = new FNOP();

        return fBound;
    };
}

if (!Array.isArray) {
    Array.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
}
