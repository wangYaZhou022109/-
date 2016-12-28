var D = require('drizzlejs');
var $ = require('jquery');

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
                var itemactivity = D.assign({}, activity, { name: item.name, coverId: item.cover });
                if (itemactivity.coverId) {
                    itemactivity.cover = that.bindings.down.getFullUrl() + '?id=' + itemactivity.coverId;
                }
                itemactivity.description = $('<span>').html(itemactivity.description).text();
                sortItem[item.sort] = itemactivity;
            });
            return sortItem;
        }
    }
};
