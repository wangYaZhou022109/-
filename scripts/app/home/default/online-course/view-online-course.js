var D = require('drizzlejs');

module.exports = {
    bindings: { course: true, homeConfig: true },
    dataForTemplate: {
        course: function(data) {
            var courseMap = {};
            var sortItem = {};
            data.course.length && data.course.forEach(function(c) {
                courseMap[c.id] = c;
            });
            data.homeConfig.items.forEach(function(item) {
                var course = courseMap[item.sourceId];
                var itemCourse = D.assign({}, course, item);
                sortItem[item.sort] = itemCourse;
            });
            return sortItem;
        }
    }
};
