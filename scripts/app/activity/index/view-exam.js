var toArray;

exports.bindings = {
    down: false,
    exams: true
};

exports.events = {
    'click exam-*': 'showExamPrompt'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this;
        me.module.dispatch('search', { type: el });
    },
    showExamPrompt: function(id) {
        var mod = this.module.items['activity/index/exam-prompt'],
            me = this;
        me.app.viewport.modal(mod, { examId: id });
    }
};

exports.dataForTemplate = {
    examArray: function() {
        var data = this.bindings.exams.data;
        return toArray(data, 6);
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
}];
