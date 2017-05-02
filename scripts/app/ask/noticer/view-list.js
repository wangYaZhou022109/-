var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    member: true,
    page: true,
    down: false
};

exports.events = {
    'click member-*': 'details',
    'click follow-me': 'showFollowMe'
};

exports.handlers = {
    details: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-page')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/expertdetails', { id: id });
    },
    showFollowMe: function() {
        var model = this.module.items['ask/followme'];
        this.app.viewport.modal(model);
    }
};

exports.dataForTemplate = {
    page: function(data) {
        var member = data.member.memberList;
        var page = this.bindings.page.data;
        var me = this;
        var flag = true;
        _.forEach(member, function(value) {
            var obj = value;
            var url = obj.headPortrait;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.headPortrait = 'images/default-userpic.png';
            } else {
                obj.headPortrait = this.bindings.down.getFullUrl() + '?id=' + url;
            }
            _.forEach(me.bindings.page.data, function(v) {
                if (v.id === obj.id) {
                    flag = false;
                }
            });
            if (flag) {
                page.push(obj);
            }
        });
        return page;
    }
};
