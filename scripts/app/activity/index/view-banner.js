exports.bindings = {
    activitys: true,
    down: true
};

exports.components = [function() {
    var activitys = this.bindings.activitys.data,
        obj;
    if (!activitys || activitys.length < 1) {
        return false;
    }
    obj = {
        id: 'activitys-ul',
        name: 'swiper',
        options: {
        }
    };
    return obj;
}];

exports.dataForTemplate = {
    activitys: function(data) {
        var downUrl = this.bindings.down.getFullUrl();
        var defultImg = 'images/default-cover/default_exam.jpg';
        if (data.activitys.forEach) {
            data.activitys.forEach(function(obj) {
                var activity = obj || {};
                activity.img = activity.coverId ? (downUrl + '?id=' + activity.coverId) : defultImg;
                if (activity.description) {
                    activity.description = activity.description.replace(/<[^>]+>/g, '').substr(0, 20);
                }
            });
        }
        return data.activitys;
    }
};
