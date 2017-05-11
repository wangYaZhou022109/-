var _ = require('lodash/collection'),
    toArray;

exports.bindings = {
    down: true,
    gensees: true,
    exams: true,
    researchActivitys: true
};

exports.events = {
    'click attendLive-*': 'attendLive',
    'click exam-*': 'showExamPrompt',
    'click research-*': 'showResearchIndex'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this;
        me.module.dispatch('search', { type: el });
    },
    attendLive: function(id) {
        window.open('#/activity/gensee/detail/' + id, '_blank');
    },
    showExamPrompt: function(id) {
        var mod = this.module.items['activity/index/exam-prompt'],
            me = this;
        me.app.viewport.modal(mod, { examId: id });
    },
    showResearchIndex: function(id) {
        var url = 'exam/research-activity/index/' + id,
            me = this;
        return this.module.dispatch('getResearchById', { id: id }).then(function() {
            me.app.navigate(url, true);
        });
    }
};

exports.dataForTemplate = {
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
    },
    hasGensee: function(data) {
        return data.gensees && data.gensees.length > 0;
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
