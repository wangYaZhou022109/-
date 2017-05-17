var $ = require('jquery');

exports.events = {
    'click membership-*': 'toggleMembership',
    'click signup': 'showSignup',
    'click verify-*': 'showVerify',
    'click studentgroup': 'showStudentgroup',
    'click entersituation': 'showEntersituation',
    'click addstudent': 'showAddstudent',
    'click stuname-*': 'showStuname'
};

exports.handlers = {
    toggleMembership: function(id) {
        $(this.$('membership-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('membership-content-' + id)).show().siblings().hide();
    },
    showSignup: function() {
        var model = this.module.items['center/managements/signup'];
        this.app.viewport.modal(model);
    },
    showVerify: function() {
        var model = this.module.items['center/managements/verify'];
        this.app.viewport.modal(model);
    },
    showStudentgroup: function() {
        var model = this.module.items['center/managements/studentgroup'];
        this.app.viewport.modal(model);
    },
    showEntersituation: function() {
        var model = this.module.items['center/managements/entersituation'];
        this.app.viewport.modal(model);
    },
    showAddstudent: function() {
        var model = this.module.items['center/managements/addstudent'];
        this.app.viewport.modal(model);
    },
    showStuname: function() {
        var model = this.module.items['center/managements/stuname'];
        this.app.viewport.modal(model);
    }
};
