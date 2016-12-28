exports.bindings = {
    course: true
};
exports.dataForTemplate = {
    topics: function(data) {
        return data.course.courseTopics;
    }
};
