exports.bindings = {
    activitys: true,
    params: true,
    down: true
};

exports.events = {
    'click category-item-*': 'toggleItem',
    'click to-activity-*': 'toActivity'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this;
        me.module.dispatch('search', { type: el });
    },
    toActivity: function(id, e, s) {
        var type = s.type;
        if (type === '1') {
            this.app.show('content', 'exam/index', { id: id });
        } else if (type === '2') {
            this.app.show('content', 'exam/index', { id: id });
        } else if (type === '3' || type === '4' || type === '5') {
            this.app.show('content', 'exam/index', { id: id });
        } else if (type === '6') {
            this.app.show('content', 'exam/index', { id: id });
        }
    }
};

exports.dataForTemplate = {
    activitys: function(data) {
        var downUrl = this.bindings.down.getFullUrl();
        var defultImg = 'images/default-cover/default_exam.jpg';
        data.activitys.forEach(function(obj) {
            var activity = obj || {};
            activity.img = activity.coverId ? (downUrl + '?id=' + activity.coverId) : defultImg;
            if (activity.description) {
                activity.description = activity.description.replace(/<[^>]+>/g, '').substr(0, 20);
            }
        });
        return data.activitys;
    },
    type: function() {
        var params = this.bindings.params.data;
        params.types = {};
        if (!params.type || params.type === 0) {
            params.types.all = true;
        } else if (params.type === 1) {
            params.types.class = true;
        } else if (params.type === 3) {
            params.types.exam = true;
        } else if (params.type === 6) {
            params.types.survey = true;
        } else if (params.type === 2) {
            params.types.live = true;
        }
        return params;
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'activitys' }
}];
