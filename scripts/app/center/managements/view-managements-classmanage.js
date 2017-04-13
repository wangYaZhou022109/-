var $ = require('jquery');

exports.events = {
    'click classmanage-*': 'toggleClassmanage',
    'click reply-*': 'showComment',
    'click addattendance': 'showAddattendance',
    'click edit-*': 'showAddattendance',
    'click attendancelist-*': 'showAttendancelist',
    'click leave-*': 'showLeave',
    'click classedit-*': 'showClassedit',
    'click count-*': 'showCount'
};

exports.handlers = {
    toggleClassmanage: function(id) {
        $(this.$('classmanage-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('classmanage-content-' + id)).show().siblings().hide();
    },
    showComment: function(id) {
        $(this.$('comment-reply-' + id)).toggleClass('show');
    },
    showAddattendance: function() {
        var model = this.module.items['center/managements/addattendance'];
        this.app.viewport.modal(model);
    },
    showAttendancelist: function() {
        var model = this.module.items['center/managements/attendancelist'];
        this.app.viewport.modal(model);
    },
    showLeave: function() {
        var model = this.module.items['center/managements/leave'];
        this.app.viewport.modal(model);
    },
    showClassedit: function() {
        var model = this.module.items['center/managements/classedit'];
        this.app.viewport.modal(model);
    },
    showCount: function() {
        var model = this.module.items['center/managements/count'];
        this.app.viewport.modal(model);
    }
};
