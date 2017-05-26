var toArray;

exports.bindings = {
    down: false,
    researchActivitys: true
};

exports.events = {
    'click research-*': 'showResearchIndex'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this;
        me.module.dispatch('search', { type: el });
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
    researchArray: function() {
        var data = this.bindings.researchActivitys.data;
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
    id: 'swiper-5',
    name: 'swiper',
    options: {
        slider: true
    }
}];
