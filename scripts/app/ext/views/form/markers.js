var $ = require('jquery');
var markers = {
    text: {
        valid: function(el) {
            if (!el.hasClass('error')) return;
            el.next().remove();
            el.removeClass('error');
        },
        invalid: function(el, message) {
            if (el.hasClass('error')) markers.text.valid(el);
            $('<span class="error-text">' + el.prev().text() + message + '</span>').insertAfter(el);
            el.addClass('error');
        }
    },
    selectize: {
        valid: function(el) {
            markers.text.valid(el.next());
        },
        invalid: function(el, message) {
            markers.text.invalid(el.next(), message);
        }
    },
    group: {
        valid: function(el) {
            if (!el.hasClass('error')) return;
            el.parent().next().remove();
            el.removeClass('error');
        },
        invalid: function(el, message) {
            if (el.hasClass('error')) return;
            $('<span class="error-text">' + el.parent().prev().text() + message + '</span>').insertAfter(el.parent());
            el.addClass('error');
        }
    }
};

module.exports = markers;
