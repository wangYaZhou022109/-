var $ = require('jquery');

exports.type = 'form';

exports.bindings = {
    research: true,
    img: false
};

exports.components = [
    {
        id: 'start-time',
        name: 'flatpickr',
        options: {
            enableTime: true
        }
    }, {
        id: 'end-time',
        name: 'flatpickr',
        options: {
            enableTime: true
        }
    }, {
        id: 'is-anonymity',
        name: 'selectize'
    }, {
        id: 'permit-view-count',
        name: 'selectize'
    }, {
        id: 'answer-paper-rule',
        name: 'selectize'
    }, {
        id: 'questionary-detail',
        name: 'rich-text',
        options: {
            model: 'img',
            items: []
        }
    },
    function() {
        var research = this.bindings.research,
            remote = {
                value: this.app.global.currentUser.id,
                text: this.app.global.currentUser.name
            },
            member = {},
            data;

        if (research.data.publisherMember) {
            member.value = research.data.publisherMember.id;
            member.text = research.data.publisherMember.name || research.data.publisherMember.text;
        } else {
            member = remote;
        }

        data = {
            id: 'publisherMember',
            name: 'picker',
            options: {
                module: 'exam/research-activity',
                picker: 'member',
                inputName: 'publishMemberId',
                required: true,
                data: member
            }
        };
        return data;
    },
    function() {
        var research = this.bindings.research,
            remote = {
                id: this.app.global.currentUser.organization.id,
                text: this.app.global.currentUser.organization.name
            },
            pub = {},
            data;

        if (research.data.publishOrganization) {
            pub.id = research.data.publishOrganization.id;
            pub.text = research.data.publishOrganization.name || research.data.publishOrganization.text;
        } else {
            pub = remote;
        }

        data = {
            id: 'organization',
            name: 'picker',
            options: {
                module: 'exam/research-activity',
                picker: 'owner',
                required: true,
                params: { operatorType: this.app.global.EDIT },
                data: pub,
                inputName: 'organizationId'
            }
        };
        return data;
    },
    function() {
        var research = this.bindings.research,
            remote = {
                id: this.app.global.currentUser.organization.id,
                text: this.app.global.currentUser.organization.name
            },
            pub = {},
            data;

        if (research.data.publishOrganization) {
            pub.id = research.data.publishOrganization.id;
            pub.text = research.data.publishOrganization.name || research.data.publishOrganization.text;
        } else {
            pub = remote;
        }

        data = {
            id: 'publishOrganization',
            name: 'picker',
            options: {
                module: 'exam/research-activity',
                picker: 'owner',
                required: true,
                params: { operatorType: this.app.global.EDIT },
                data: pub,
                inputName: 'publishOrganizationId'
            }
        };
        return data;
    },
    function() {
        var btnName = this.app.global.setting['exam.exam.cover-id'];
        var research = this.bindings.research.data;
        var data = {
            id: 'exam-cover',
            name: 'picker',
            options: {
                picker: 'upload',
                inputName: 'coverId',
                signle_file: true,
                width: 2560,
                height: 800,
                data: { btnName: btnName, btnClass: 'block', defaultCss: 'exam-pic' }
            }
        };
        data.options.data.value = research.coverId;
        return data;
    },
    function() {
        var initialTags = this.bindings.research.data.topics || [],
            data;
        data = {
            id: 'topic',
            name: 'picker',
            options: {
                picker: 'topics',
                required: false,
                tags: initialTags,
                limit: 5
            }
        };
        return data;
    }
];

exports.dataForTemplate = {
    check: function() {
        var data = this.bindings.research.data;
        if (data) {
            return {
                isAnonymity: {
                    yes: data.isAnonymity === 1,
                    no: data.isAnonymity === 0
                },
                permitViewCount: {
                    yes: data.permitViewCount === 1,
                    no: data.permitViewCount === 0
                },
                answerPaperRule: {
                    mutiple: data.answerPaperRule === 1,
                    single: data.answerPaperRule === 2
                }
            };
        }
        return null;
    }
};

exports.mixin = {
    check: function() {
        var startTime = new Date($(this.$$('[name="startTime"]')).val()).getTime(),
            endTime = new Date($(this.$$('[name="endTime"]')).val()).getTime();

        if (startTime > endTime) {
            this.app.message.error('开始时间不能大于结束时间');
            return false;
        }

        return true;
    },
    getData: function() {
        var comp = this.components.topic;
        return comp && comp.getData();
    }
};
