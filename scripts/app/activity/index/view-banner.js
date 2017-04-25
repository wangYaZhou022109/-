var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    defaultImg = {
        1: 'images/default-cover/default_class.jpg',
        2: 'images/default-cover/default_live.jpg',
        3: 'images/default-cover/default_exam.jpg',
        4: 'images/default-cover/default_survey.jpg',
        5: 'images/default-cover/default_course.jpg',
    };

exports.bindings = {
    activitys: true,
    down: true
};

exports.components = [function() {
    var activitys = this.bindings.activitys.data,
        obj = {
            id: 'activitys-ul',
            name: 'swiper',
            options: {
                current: 1
            }
        };

    if (activitys && activitys.length > 0) {
        return obj;
    }

    return null;
}];

exports.dataForTemplate = {
    activitys: function(data) {
        var downUrl = this.bindings.down.getFullUrl();
        return _.map(data.activitys, function(a) {
            return D.assign(a, {
                coverId: a.coverId ? (downUrl + '?id=' + a.coverId) : defaultImg[a.type],
                description: a.description.replace(/<[^>]+>/g, '').substr(0, 20)
            });
        });
    }
};
