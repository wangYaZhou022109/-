exports.bindings = {
    announcements: true
};

exports.dataForTemplate = {
    announcements: function() {
        var announcements = this.bindings.announcements.data.items;
        if (announcements && announcements.length > 0 && !announcements[0].announcementDetail.readStatus) {
            announcements[0].announcementDetail.readStatus = 0;
        }
        return announcements;
    },
    recordCount: function() {
        return this.bindings.announcements.data.recordCount;
    }
};

exports.actions = {
    'click prevNotice': 'prevNotice', // 上一页
    'click nextNotice': 'nextNotice' // 下一页
};

exports.dataForActions = {
    prevNotice: function() {
        var recordCount = this.bindings.announcements.data.recordCount;
        var page = window.parseInt(this.bindings.announcements.params.page) - 1;
        if (page === 0) {
            page = recordCount;
        }
        return { page: page, pageSize: 1 };
    },
    nextNotice: function() {
        var recordCount = this.bindings.announcements.data.recordCount;
        var page = window.parseInt(this.bindings.announcements.params.page) + 1;
        if (page > recordCount) {
            page = 1;
        }
        return { page: page, pageSize: 1 };
    }
};

exports.events = {
    'click showMore': 'showMore'
};

exports.handlers = {
    showMore: function() {
        var me = this,
            model = this.module.items['center/index/more'];
        me.app.viewport.modal(model, {
            callback: function() {
                me.module.dispatch('insertReadState');
            }
        });
    }
};
