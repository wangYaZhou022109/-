var $ = require('jquery');
exports.bindings = {
    downloadexternal: false
};
exports.buttons = [{
    text: '导出',
    fn: function() {
        var url = this.bindings.downloadexternal.getFullUrl();
        var radio = $(this.$$('input[name="radio"]:checked')).val();
        var token = this.app.global.OAuth.token.access_token;
        url += ('?id=' + this.module.renderOptions.state.classId + '&radio=' + radio + '&access_token=' + token);
        window.location.href = url;
    }
}];

