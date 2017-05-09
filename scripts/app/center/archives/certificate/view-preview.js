var _ = require('lodash/collection');

exports.title = function() {
    return '查看证书';
};

exports.bindings = {
    certificate: true,
    down: false
};

exports.dataForTemplate = {
    certificate: function(data) {
        var certificate = data.certificate,
            cover = data.certificate.certTemplate.cover,
            examplesStr = data.certificate.certTemplate.htmlCode;

        _.map(certificate.certTemplate.configList, function(item) {
            examplesStr = examplesStr.replace(item.paramCode, item.paramExamples);
        });

        if (cover) {
            if (cover.indexOf('certificate') < 0) {
                certificate.coverUrl = this.bindings.down.getFullUrl() + '?id=' + cover;
            } else {
                certificate.coverUrl = cover;
            }
        }

        certificate.htmlExamples = examplesStr;
        return certificate;
    }
};
