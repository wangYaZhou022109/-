exports.bindings = {
    research: true
};

exports.components = [function() {
    var id = this.bindings.research.data.id;
    return {
        id: 'qrcode',
        name: 'qrcode',
        options: {
            text: id
        }
    };
}];

exports.dataForTemplate = {
    researchUrl: function(data) {
        return 'https://zxy9.zhixueyun.com/#/exam/research-activity/index/' + data.research.id;
    }
};
