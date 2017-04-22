// var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    member: true,
    page: true
};

exports.events = {
};

exports.handlers = {
};

exports.dataForTemplate = {
    page: function(data) {
        var member = data.member.memberList;
        var page = this.bindings.page.data;
        var me = this;
        var flag = true;
        _.forEach(member, function(value) {
            var obj = value;
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
exports.beforeClose = function() {
    $(window).unbind('scroll');
};

