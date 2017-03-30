
var $ = require('jquery');

module.exports.judge = function(text) { // 同步调用敏感词验证，返回敏感词数，大于0说明有敏感词。
    var num = 0,
        sensitive = {
            url: '.' + window.app.options.urlRoot + '/system/sensitive/judge',
            method: 'POST',
            dataType: 'json',
            async: false };
    sensitive.data = { text: text };
    $.ajax(sensitive).done(function(data) {
        num = data;
    });
    return num;
};
