var trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};

module.exports = {
    required: {
        fn: function(value) {
            return trim(value) && trim(value).length > 0;
        },
        length: 0,
        message: '为必填项'
    },
    idCard: {
        fn: function(value) {
            if (trim(value) === '') {
                return true;
            }
            return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(value);
        },
        length: 0,
        message: '格式不正确'
    },
    number: {
        fn: function(value) {
            if (trim(value) === '') {
                return true;
            }
            return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
        },
        length: 0,
        message: '只能填数字'
    },
    chinese: {
        fn: function(value) {
            if (trim(value) === '') {
                return true;
            }
            return /^[\u4e00-\u9fa5]+$/.test(value);
        },
        length: 0,
        message: '只能填汉字'
    },
    digits: {
        fn: function(value) {
            if (trim(value) === '') {
                return true;
            }
            return /^\d+$/.test(value);
        },
        length: 0,
        message: '只能填整数'
    },
    length: {
        fn: function(value, len) {
            return trim(value).length === len;
        },
        length: 1,
        message: '长度应该为: {0}'
    },
    minLength: {
        fn: function(value, min) {
            if (trim(value) === '') {
                return true;
            }
            return trim(value).length >= min;
        },
        length: 1,
        message: '最小长度为: {0}'
    },
    maxLength: {
        fn: function(value, max) {
            if (trim(value) === '') {
                return true;
            }
            return trim(value).length <= max;
        },
        length: 1,
        message: '最大长度为: {0}'
    },
    lessThan: {
        fn: function(value, target) {
            return Number(value) <= target;
        },
        length: 1,
        message: '超出'
    },
    min: {
        fn: function(value, min) {
            return Number(value) >= min;
        },
        length: 1,
        message: '最小值为: {0}'
    },
    range: {
        fn: function(value, min, max) {
            var v;
            if (!value) return true;
            v = Number(value);
            return v >= min && v <= max;
        },
        length: 2,
        message: '必须在 {0} ~ {1} 之间'
    },
    equalTo: {
        fn: function(value, target) {
            return value === target;
        },
        length: 1,
        message: '不一致'
    },
    phone: {
        fn: function(value) {
            if (trim(value) === '') {
                return true;
            }
            return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value);
        },
        length: 0,
        message: '格式不正确'
    },
    email: {
        fn: function(value) {
            if (trim(value) === '') {
                return true;
            }

            // eslint-disable-next-line max-len,no-control-regex
            return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
        },
        length: 0,
        message: '格式不正确'
    },
    regexp: {
        fn: function(value, regexp) {
            if (trim(value) === '') {
                return true;
            }
            return regexp.test(value);
        },
        length: 1,
        message: '格式不正确'
    }
};
