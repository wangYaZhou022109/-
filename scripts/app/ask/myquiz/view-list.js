
exports.type = 'dynamic';
exports.bindings = {
    params: false,
    questions: true
};

exports.events = {
    'click myquiz-details-*': 'showDetails'
};

exports.handlers = {
    // showDetails: function(id, e, target) {
    //     var region;
    //     var el = $(target).parents('.comment-list')[0];
    //     region = new D.Region(this.app, this.module, el, id);
    //     region.show('ask/myquiz/details', { id: id });
    // },
    showDetails: function(payload) {
        // var data = { },
        //     id = payload;
        // console.log(payload);
        // if (id.indexOf('_') !== -1) {
        //     data = id.split('_');
            // region = new D.Region(this.app, this.module, el, data[1]);
            // region.show('ask/myquiz/details', { id: data[1] });
        this.app.show('content', 'ask/myquiz/details', { id: payload });
        // }
    },
};

exports.actions = {
    'click remove-*': 'remove',
    'click concern-*': 'concern',
    'click enjoy-*': 'enjoy',
    'click report-*': 'report'
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
    }
};

