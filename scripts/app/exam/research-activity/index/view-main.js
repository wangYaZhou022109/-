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
            remote = 2,
            i = 0,
            url = 'images/d1.jpg',
            relativeResearchs = data.relativeResearchs;

        for (i; i < remote; i++) {
            if (i + 1 === 3) break;
            if (relativeResearchs[i].coverId) {
                url = me.bindings.down.getFullUrl() + '?id=' + relativeResearchs[i].coverId;
            }
            result.push(D.assign(relativeResearchs[i], {
                coverId: url
            }));
        }
        return result;
    }
};
