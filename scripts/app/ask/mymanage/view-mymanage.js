var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    mymanage: true,
    todayadd: true
};
exports.events = {
    'click topicDetail-*': 'showDetails'
};

exports.handlers = {
    topicDeal: function() {
    },
    showDetails: function(payload) {
        // var data = { },
        //     id = payload;
        // console.log(payload);
        // if (id.indexOf('_') !== -1) {
        //     data = id.split('_');
            // region = new D.Region(this.app, this.module, el, data[1]);
            // region.show('ask/myquiz/details', { id: data[1] });
        this.app.show('content', 'ask/mymanage/topicdetail', { id: payload });
        // }
    }
};
exports.dataForTemplate = {
    mymanage: function(data) {
        var mymanage = data.mymanage,
            me = this;
        _.forEach(mymanage, function(value) {
            var obj = value,
                url = obj.attachmentId;
            // console.log(obj.todayQuestionSum);
            // console.log(obj.todayShareSum);
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.attachmentId = 'images/default-cover/default_topic.jpg';
            } else {
                obj.attachmentId = me.bindings.down.getFullUrl() + '?id=' + url;
            }
        });
        return mymanage;
    }
};

