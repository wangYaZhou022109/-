var D = require('drizzlejs');
var $ = require('jquery');

var activityTypeMap = {
    1: '培训',
    2: '直播',
    3: 'exam/index/', // '模拟考试'
    4: 'exam/index/', // '指定考试'
    5: 'exam/index/', // '报名考试'
    6: '问卷', // '问卷调查'
    7: 'exam/index/' // '补考'
};

module.exports = {
    bindings: { activity: true, homeConfig: true, down: true },
    dataForTemplate: {
        activity: function(data) {
            var activityMap = {};
            var sortItem = {};
            var that = this;
            data.activity.length && data.activity.forEach(function(c) {
                activityMap[c.id] = c;
            });
            data.homeConfig.items.forEach(function(item) {
                var activity = activityMap[item.sourceId];
                var itemactivity = D.assign({}, activity, { coverId: item.cover });
                if (itemactivity.coverId) {
                    itemactivity.cover = that.bindings.down.getFullUrl() + '?id=' + itemactivity.coverId;
                }
                if (itemactivity.type) {
                    itemactivity.url = activityTypeMap[itemactivity.type] + item.sourceId;
                }
                itemactivity.description = $('<span>').html(itemactivity.description).text();
                sortItem[item.sort] = itemactivity;
            });
            return sortItem;
        }
    }
};
