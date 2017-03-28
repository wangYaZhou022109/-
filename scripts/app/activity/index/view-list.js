var _ = require('lodash/collection'),
    toArray;

exports.bindings = {
    activitys: true,
    params: true,
    down: true,
    gensees: true,
    exams: true,
    researchActivitys: true,
    toDos: true,
    researchRecord: false
};

exports.events = {
    'click category-item-*': 'toggleItem',
    'click to-activity-*': 'toActivity',
    'click attendLive-*': 'attendLive',
    'click exam-*': 'showExamPaper',
    'click research-*': 'showResearchIndex'
};
exports.actions = {
    'click exam-left': 'examLeft',
    'click exam-right': 'examRight',
    'click research-left': 'researchLeft',
    'click research-right': 'researchRight'
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
    },
    attendLive: function(id) {
        window.open('#/activity/gensee/detail/' + id, '_blank');
    },
    showExamPaper: function(id) {
        var mod = this.module.items['exam-tips'],
            me = this;
        return this.module.dispatch('getExamById', { id: id }).then(function(data) {
            me.app.viewport.modal(mod, { exam: data });
        });
    },
    showResearchIndex: function(id) {
        var url = '#/exam/research-activity/index/' + id;
        window.open(url, '_blank');
    }
};

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
    },
    examArray: function(data) {
        return toArray(data.exams, 6);
    },
    researchArray: function(data) {
        return toArray(data.researchActivitys, 6);
    },
    genseesArray: function(data) {
        var defultImg = 'images/default-cover/default_live.jpg',
            downUrl = this.bindings.down.getFullUrl();
        _.map(data.gensees || [], function(item) {
            var gensee = item;
            gensee.cover = gensee.cover ? (downUrl + '?id=' + gensee.cover) : defultImg;
        });
        return toArray(data.gensees, 5);
    },
};

toArray = function(objs, pageSize) {
    var array = [],
        num = 0,
        temp = [],
        obj,
        i;
    if (objs && objs.length) {
        for (i = 1; i <= objs.length; i++) {
            temp.push(objs[i - 1]);
            if (i % pageSize === 0) {
                obj = {};
                obj.a = temp;
                array.push(obj);
                num++;
                temp = [];
            }
        }
        if (temp.length > 0) {
            obj = {};
            obj[num] = temp;
            array.push(obj);
        }
        return array;
    }
    return [];
};
exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'exams' }
}, {
    id: 'swiper-3',
    name: 'swiper',
    options: {
        slider: true
    }
}, {
    id: 'swiper-2',
    name: 'swiper',
    options: {
        slider: true
    }
}, {
    id: 'swiper-5',
    name: 'swiper',
    options: {
        slider: true
    }
}];
