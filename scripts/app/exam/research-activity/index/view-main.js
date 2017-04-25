var D = require('drizzlejs');

exports.bindings = {
    research: true,
    relativeResearchs: true,
    down: true
};

exports.dataForTemplate = {
    relativeResearchs: function(data) {
        var me = this,
            result = [],
            remote = 300, // 相关调研，最多显示三个
            i = 0,
            url = 'images/default-cover/default_survey.jpg',
            relativeResearchs = data.relativeResearchs;
        if (relativeResearchs && relativeResearchs.length > 0) {
            for (i; i < relativeResearchs.length; i++) {
                if (i === remote) break;
                if (relativeResearchs[i].coverId) {
                    url = me.bindings.down.getFullUrl() + '?id=' + relativeResearchs[i].coverId;
                }
                result.push(D.assign(relativeResearchs[i], {
                    coverId: url
                }));
            }
        }
        return result;
    }
};

exports.events = {
    'click research-*': 'showResearchIndex'
};

exports.handlers = {
    showResearchIndex: function(id) {
        var url = '#/exam/research-activity/index/' + id;
        // this.app.navigate(url, true);
        window.open(url, '_blank');
    }
};
