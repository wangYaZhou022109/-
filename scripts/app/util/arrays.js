/**  实现数组的findIndex */

var baseFindIndex, identity, baseIteratee,
    D = require('drizzlejs');

baseFindIndex = function(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
        if (predicate(array[index], index, array)) {
            return index;
        }
    }
    return -1;
};
identity = function(value) {
    return value;
};
baseIteratee = function(func) {
    if (typeof func === 'function') {
        return func;
    }
    return identity;
};

D.assign(Array.prototype, {
    findIndex: function(predicate, fromIndex) {
        var length = this ? this.length : 0,
            index = fromIndex ? Number(fromIndex) : 0;
        if (!length) {
            return -1;
        }
        if (index < 0) {
            index = 0;
        }
        return baseFindIndex(this, baseIteratee(predicate), index);
    }
});

module.exports = {
    findIndex: function(array, predicate, fromIndex) {
        var length = array ? array.length : 0,
            index = fromIndex ? Number(fromIndex) : 0;
        if (!length) {
            return -1;
        }
        if (index < 0) {
            index = 0;
        }
        return baseFindIndex(array, baseIteratee(predicate), index);
    }
};

