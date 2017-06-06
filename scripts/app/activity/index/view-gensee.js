var _ = require('lodash/collection'),
    toArray;

exports.bindings = {
    down: false,
    gensees: true
};

exports.events = {
    'click attendLive-*': 'attendLive'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this;
        me.module.dispatch('search', { type: el });
    },
    attendLive: function(id) {
        window.open('#/activity/gensee/detail/' + id, '_blank');
    }
};

exports.dataForTemplate = {
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
exports.components = [function() {
    var me = this,
        obj = {
            id: 'swiper-2',
            name: 'swiper',
            options: {
                slider: true,
                translateLeft: function() {
                    return me.module.dispatch('turnToModelPage', { model: 'gensees', dir: 'prev' });
                },
                translateRight: function() {
                    return me.module.dispatch('turnToModelPage', { model: 'gensees', dir: 'next' });
                }
            }
        };
    return obj;
}];
