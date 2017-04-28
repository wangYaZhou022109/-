var $ = require('jquery');

module.exports = {
    isNull: function(v) {
        return v && v === '';
    },
    isInputNumber: function(k) {
        return k === 46 || (k >= 48 && k <= 57);
    },
    isKeepOneDecimal: function(v) {
        return /^\d+[.]?[1-9]?$/.test(v);
    },
    isOverRange: function(v, target) {
        return v > target;
    },
    setError: function(msg, errorEl, targetEl) {
        $(errorEl).html('<span class="error-text">' + msg + '</span>');
        $(targetEl).addClass('error');
    },
    clearError: function(errorEl, targetEl) {
        $(errorEl).html('');
        $(targetEl).removeClass('error');
    }
};
