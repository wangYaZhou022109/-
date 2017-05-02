var D = require('drizzlejs'),
    _ = require('lodash/collection'),
    strings = require('./app/util/strings'),
    JOIN_STATUS = 1;

exports.items = {
    info: 'info',
    search: 'search',
    content: 'content',
    'exam/research-activity/manage/summary': { isModule: true },
    'picker/members/select-member': { isModule: true },
    'train/programme/research-activity/manage/detail': { isModule: true },
    'train/programme/research-activity/manage/urge': { isModule: true }
};

exports.title = '调研详情';

exports.large = true;

exports.store = {
    models: {
        research: {
            url: '../exam/research-activity/simple-data',
            mixin: {
                getResearchRecordById: function(id) {
                    var datas = this.module.store.models.researchRecords.data;
                    return _.find(datas, ['id', id]);
                }
            }
        },
        researchRecords: {
            url: '../exam/research-record',
            type: 'pageable',
            root: 'items'
        },
        researchRecordAll: {
            url: '../exam/research-record/find-all'
        },
        addMember: { url: '../exam/research-activity/add-member' }
    },
    callbacks: {
        init: function(payload) {
            var me = this;
            this.models.research.set({ id: payload.id });
            this.models.researchRecords.params = { researchQuestionaryId: payload.id };
            this.models.researchRecordAll.params = { researchQuestionaryId: payload.id };
            return this.chain([
                this.get(this.models.research),
                this.get(this.models.researchRecords),
            ], this.get(this.models.researchRecordAll)).then(function() {
                var data = me.models.researchRecordAll.data,
                    joinNumber = _.filter(data, function(d) {
                        return d.status === JOIN_STATUS;
                    }).length;
                D.assign(me.models.research.data, {
                    joinNumber: joinNumber,
                    noJoinNumber: data.length - joinNumber
                });
                me.models.research.changed();
            });
        },
        search: function(payload) {
            D.assign(this.models.researchRecords.params, payload);
            D.assign(this.models.researchRecordAll.params, payload);
            return this.chain([
                this.get(this.models.researchRecords),
                this.get(this.models.researchRecordAll)
            ]);
        },
        addMember: function(payload) {
            var me = this;
            this.models.addMember.set(D.assign(payload, {
                researchQuestionaryId: this.models.research.data.id
            }));
            return this.post(this.models.addMember).then(function() {
                me.app.message.success(strings.get('exam.research.manage.add-member-success'));
                return me.get(this.models.researchRecords);
            });
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};

