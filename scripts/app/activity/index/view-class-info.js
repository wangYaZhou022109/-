var toArray;

exports.bindings = {
    down: false,
    classDetailes: true,
    classSignupByclassId: true
};

exports.events = {
    'click class-*': 'getClassSignupByclassId'
};

exports.handlers = {
    toggleItem: function(el) {
        var me = this;
        me.module.dispatch('search', { type: el });
    },
    getClassSignupByclassId: function(id) {
        var me = this;
        this.module.dispatch('getClassSignupByclassId', { id: id }).then(function(data) {
            var classSignupByclassId = data[0] || {};
            var nowTime = (new Date()).getTime();
            var url = '#/train/sign-up/' + classSignupByclassId.classId + '?activity';
            if (classSignupByclassId.isOpen === 0) {
                me.app.message.error('该培训班暂未开放报名!');
            } else if (nowTime < classSignupByclassId.startTime) {
                me.app.message.error('当前培训班报名尚未开始!');
            } else if (nowTime > classSignupByclassId.endTime) {
                me.app.message.error('当前培训班报名已结束!');
            } else {
                window.location.href = url;
            }
        });
    }
};

exports.actionCallbacks = {
    getClassSignupByclassId: function(data) {
        var classSignupByclassId = data[0] || {};
        var nowTime = (new Date()).getTime();
        var url = '#/train/sign-up/' + classSignupByclassId.classId;
        if (classSignupByclassId.isOpen === 0) {
            this.app.message.error('该培训班暂未开放报名!');
        } else if (nowTime < classSignupByclassId.startTime) {
            this.app.message.error('当前培训班报名尚未开始!');
        } else if (nowTime > classSignupByclassId.endTime) {
            this.app.message.error('当前培训班报名已结束!');
        } else {
            window.location.href = url;
        }
    }
};

exports.dataForTemplate = {
    classArray: function() {
        var data = this.bindings.classDetailes.data;
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
    id: 'swiper-4',
    name: 'swiper',
    options: {
        slider: true
    }
}];
