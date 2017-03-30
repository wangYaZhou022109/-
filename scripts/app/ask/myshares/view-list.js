
exports.type = 'dynamic';
exports.bindings = {
    params: false,
    myshares: true
};

exports.events = {
    'click myshares-details-*': 'showDetails'
};

exports.handlers = {
    // toggleMore: function(id, e, target) {
    //     var region;
    //     var el = $(target).parents('.activity-category')[0];
    //     region = new D.Region(this.app, this.module, el, id);
    //     region.show('ask/myshares/mydetail', { id: id });
    // }
    showDetails: function(payload) {
       // var region,
       //     data = { };
       // var el = $(target).parents('.comment-list')[0];
        var data = { },
            id = payload;
        // console.log(payload);
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            // region = new D.Region(this.app, this.module, el, data[1]);
            // region.show('ask/myquiz/details', { id: data[1] });
            this.app.show('content', 'ask/myshares/details', { id: data[1] });
        }
    }

};

exports.actions = {
    'click remove-*': 'remove',
    'click concern-*': 'concern',
    'click enjoy-*': 'enjoy',
    'click report-*': 'report',
    'click trend-follow-*': 'follow',
    'click trend-unfollow-*': 'unfollow',
};

exports.dataForActions = {
    remove: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定要删除该数据?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    follow: function(payload) {
        var id = payload.id,
            data = {};
        var obj = id.split('_');
        data.id = obj[1];
        data.concernType = obj[0];
        return data;
    },
    unfollow: function(payload) {
        var id = payload.id,
            data = {};
        var obj = id.split('_');
        data.id = obj[1];
        data.concernType = obj[0];
        return data;
    },
    concern: function() {
    },
    enjoy: function() {
    },
    report: function() {
    }
};

exports.actionCallbacks = {
    remove: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    },
    follow: function() {
        this.app.message.success('关注成功！');
        this.module.dispatch('init');
    },
    unfollow: function() {
        this.app.message.success('取消成功！');
        this.module.dispatch('init');
    },
};

