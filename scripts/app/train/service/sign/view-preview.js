exports.title = '二维码预览';

exports.bindings = {
    sign: true
};

exports.components = [function() {
    var signId = this.bindings.sign.data.id;
    return {
        id: 'qrcode',
        name: 'qrcode',
        options: {
            text: signId
        }
    };
}];

exports.dataForTemplate = {
    sign: function(data) {
        var sign = data.sign,
            url = window.location.protocol + '//' + window.location.host + '/';
        sign.path = url + '#/train/service/sign/' + sign.id;
        return sign;
    }
};
