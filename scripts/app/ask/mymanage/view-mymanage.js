var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    mymanage: true
};
exports.events = {
    'click topicDetail-*': 'showDetails'
};

exports.handlers = {
    topicDeal: function() {
    },
    // toggleMore: function(id, e, target) {
    //     var region;
    //     var data = id;
    //     console.log(id);
    //     var el = $(target).parents('.page-main')[0];
    //     console.log(el);
    //     region = new D.Region(this.app, this.module, el, id);
    //     // console.log(22222222);
    //     // console.log(id);
    //     // console.log(data);
    //     region.show('ask/mymanage/topicdetail', { id: data });
    // },
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
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.attachmentId = 'images/default-cover/default_topic.jpg';
            } else {
                obj.attachmentId = me.bindings.down.getFullUrl() + '?id=' + url;
            }
        });
        return mymanage;
    }
};

