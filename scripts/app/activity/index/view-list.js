var _ = require('lodash/collection'),
    toArray;

exports.bindings = {
    params: true,
    down: true,
    gensees: true,
    exams: true,
    researchActivitys: true,
    examOfUser: false
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
    'click research-right': 'researchRight',
    'click gensee-left': 'genseeLeft',
    'click gensee-right': 'genseeRight',
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
        return this.module.dispatch('getExamById', { id: id }).then(function() {
            var examOfUser = me.bindings.examOfUser.data;
            me.app.viewport.modal(mod, { exam: examOfUser });
        });
    },
    showResearchIndex: function(id) {
        var url = 'exam/research-activity/index/' + id,
            // mod = this.module.items['research-tips'],
            me = this;
        return this.module.dispatch('getResearchById', { id: id }).then(function() {
            // if (data.startTime > new Date().getTime()) {
            //     me.app.viewport.modal(mod, {
            //         content: '你好，本次调研尚未到调研时间，请在调研时间'
            //             + H.dateTime(data.startTime)
            //             + '~' + H.dateTime(data.endTime)
            //             + '进行调研，谢谢'
            //     });
            // } else {
            // window.open(url);
            me.app.navigate(url, true);
        });
    }
};

exports.dataForTemplate = {
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
    examArray: function() {
        var data = this.bindings.exams.data;
        return toArray(data, 6);
    },
    researchArray: function() {
        var data = this.bindings.researchActivitys.data;
        return toArray(data, 6);
    },
    genseesArray: function(data) {
        var defultImg = 'images/default-cover/default_live.jpg',
            downUrl = this.bindings.down.getFullUrl();
        _.map(data.gensees || [], function(item) {
            var gensee = item;
            gensee.cover = gensee.cover ? (downUrl + '?id=' + gensee.cover) : defultImg;
        });
        return toArray(data.gensees, 5);
    }
};

toArray = function(objs, pageSize) {
    var array = [],
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
                temp = [];
            }
        }
        if (temp.length > 0) {
            obj = {};
            obj.a = temp;
            array.push(obj);
        }
        return array;
    }
    return [];
};
exports.components = [{
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
