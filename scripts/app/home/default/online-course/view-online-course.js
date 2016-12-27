var D = require('drizzlejs');
var $ = require('jquery');

module.exports = {
    bindings: { course: true, homeConfig: true, down: true },
    dataForTemplate: {
        course: function(data) {
            var courseMap = {};
            var sortItem = {};
            var that = this;
            data.course.length && data.course.forEach(function(c) {
                courseMap[c.id] = c;
            });
            data.homeConfig.items.forEach(function(item) {
                var course = courseMap[item.sourceId];
                var itemCourse = D.assign({}, course, item);
                if (itemCourse.cover) {
                    itemCourse.cover = that.bindings.down.getFullUrl() + '?id=' + itemCourse.cover;
                }
                itemCourse.description = $('<span>').html(itemCourse.description).text();
                sortItem[item.sort] = itemCourse;
            });
            return sortItem;
        }
    }
};
