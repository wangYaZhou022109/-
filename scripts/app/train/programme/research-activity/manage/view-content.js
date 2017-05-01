var _ = require('lodash/collection');

exports.bindings = {
    researchRecords: true,
    research: false,
    researchRecordAll: false
};

exports.events = {
    'click summary': 'summary',
    'click member': 'addMember',
    'click detail-*': 'showDetail',
    'click urge-*': 'showUrge',
    'click one-key-urge': 'showOneKeyUrge'
};

exports.handlers = {
    summary: function() {
        var mod = this.module.items['train/programme/research-activity/manage/summary'],
            me = this;
        this.app.viewport.ground(mod, {
            researchQuestionaryId: me.bindings.research.data.id,
            callback: function() {
            }
        });
    },
    addMember: function() {
        var mod = this.module.items['picker/members/select-member'],
            me = this;
        this.app.viewport.modal(mod, {
            ids: '',
            singleCallback: function(data) {
                return me.module.dispatch('addMember', {
                    members: JSON.stringify(_.map(data, function(d) {
                        return d.member;
                    }))
                });
            }
        });
    },
    showDetail: function(id) {
        var mod = this.module.items['train/programme/research-activity/manage/detail'];
        this.app.viewport.ground(mod, {
            researchRecordId: id,
            callback: function() {
            }
        });
    },
    showUrge: function(id) {
        var mod = this.module.items['train/programme/research-activity/manage/urge'];
        this.app.viewport.popup(mod, {
            data: {
                researchRecords: [this.bindings.research.getResearchRecordById(id)],
                research: this.bindings.research.data
            },
            callback: function() {
            }
        });
    },
    showOneKeyUrge: function() {
        var mod = this.module.items['train/programme/research-activity/manage/urge'];
        this.app.viewport.popup(mod, {
            data: {
                researchRecords: this.bindings.researchRecordAll.data,
                research: this.bindings.research.data
            },
            callback: function() {
            }
        });
    }
};

exports.components = [
    { id: 'pager', name: 'pager', options: { model: 'researchRecords' } }
];
