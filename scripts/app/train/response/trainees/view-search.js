var $ = require('jquery'),
    maps = require('./app/util/maps'),
    _ = require('lodash/collection');

exports.bindings = {
    state: false,
    organizations: true
};

exports.actions = {
    'click search': 'search'
};

exports.dataForActions = {
    search: function() {
        var data = {
            classId: this.bindings.state.data.classId,
            auditStatus: $(this.$$('[name="auditStatus"]')).val(),
            memberFullName: $(this.$$('[name="memberFullName"]')).val(),
            organizationId: $(this.$$('[name="organizationId"]')).val()
        };
        _.forEach(data, function(v, k) {
            if (k === 'auditStatus') {
                if (v === '999') {
                    data.auditStatus = '';
                }
            }
        });
        return data;
    }
};

exports.dataForTemplate = {
    auditStatus: function() {
        var result = maps.get('trainee-response-auditStatus').sort(function(a, b) {
            return Number(a.key) - Number(b.key);
        });
        result.unshift({ key: '999', value: '全部' });
        return result;
    },
    organizations: function(data) {
        var organizations = [{ key: '', value: '全部' }];
        _.forEach(data.organizations, function(o) {
            organizations.push({ key: o.organizationId, value: o.organizationName });
        });
        return organizations;
    }
};
