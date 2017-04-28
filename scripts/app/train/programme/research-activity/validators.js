var trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};

module.exports = {
    required: {
        fn: function(value) {
            var trimIt = function(v) {
                return v.replace(/&nbsp;/g, '') && v.replace(/&nbsp;/g, '').length > 0;
            };
            return trim(value) && trim(value).length > 0 && trimIt(value);
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
            return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(trim(value));
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
            return /^\d+$/.test(trim(value));
        },
        length: 0,
        message: '只能填整数'
    },
    length: {
        fn: function(value, len) {
            return trim(value).length === Number(len);
        },
        length: 1,
        message: '长度应该为: {0}'
    },
    minLength: {
        fn: function(value, min) {
            if (trim(value) === '') {
                return true;
            }
            return trim(value).length >= Number(min);
        },
        length: 1,
        message: '最小长度为: {0}'
    },
    maxLength: {
        fn: function(value, max) {
            if (trim(value) === '') {
                return true;
            }
            return trim(value).length <= Number(max);
        },
        length: 1,
        message: '最大长度为: {0}'
    },
    lessThan: {
        fn: function(value, target) {
            return Number(value) <= Number(target);
        },
        length: 1,
        message: '超出'
    },
    min: {
        fn: function(value, min) {
            if (trim(value) === '') { // 最小值校验次于必填
                return true;
            }
            return Number(value) >= Number(min);
        },
        length: 1,
        message: '最小值为: {0}'
    },
    range: {
        fn: function(value, min, max) {
            var v;
            if (!value) return true;
            v = Number(value);
            return v >= Number(min) && v <= Number(max);
        },
        length: 2,
        message: '必须在 {0} ~ {1} 之间'
    },
    interval: {
        fn: function(value, min, minInclude, max, maxInclude) {
            var v;
            if (!value) return true;
            v = Number(value);
            if (minInclude === '1' && maxInclude === '1') return v >= min && v <= max;
            if (minInclude === '1' && maxInclude !== '1') return v >= min && v < max;
            if (minInclude !== '1' && maxInclude === '1') return v > min && v <= max;
            if (minInclude !== '1' && maxInclude !== '1') return v > min && v < max;
            return true;
        },
        length: 4,
        message: '必须在 {0} ~ {2} 之间'
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
            // eslint-disable-next-line max-len,no-control-regex,no-useless-escape
            return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
        },
        length: 0,
        message: '格式不正确'
    },
    url: {
        fn: function(value) {
            // eslint-disable-next-line max-len,no-control-regex,no-useless-escape
            return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([/\w \.-]*)*/.test(value);
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
    },
    keepDecimal: {
        fn: function(value, n) {
            var v;
            if (trim(value) === '') return true;
            v = value.toString().split('.');
            if (v.length > 1) return v[1].length <= n;
            return true;
        },
        length: 1,
        message: '超出保留小数位'
    }
};
