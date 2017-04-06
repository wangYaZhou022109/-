// 二维码生成 参考链接如下
// https://github.com/davidshimjs/qrcodejs
var D = require('drizzlejs'),
    QRCode = require('qrcodejs2');
D.ComponentManager.register('qrcode', function(view, el, options) {
    var opt = {
        text: 'none',
        width: 228,
        height: 228,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    };
    D.assign(opt, options);
    return new QRCode(el, opt);
}, function(view, comp) {
    comp;
});
