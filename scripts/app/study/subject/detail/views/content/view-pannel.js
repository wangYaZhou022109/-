var util = require('./app/study/subject/util'),
    // _ = require('lodash/collection'),
    $ = require('jquery');
exports.bindings = {
    region: false,
    subject: true,
    state: false,
    examStatus: true,
    researchStatus: true
};

exports.events = {
    'click studyBtn-*': 'beginStudy',
    'click sectionDisplay-*': 'sectionDisplay'
};

exports.handlers = {
    beginStudy: function(id, events, element) {
        var url = element.getAttribute('data-url'),
            sectionType = Number(element.getAttribute('data-section-type')),
            resourceId = element.getAttribute('data-resource-id'),
            section = this.bindings.subject.findSectionsForId(id),
            progress = section.progress || {},
            subject = this.bindings.subject.data,
            me = this,
            view;
        if (sectionType === 12 || sectionType === 13) {
            if (progress.finishStatus === 2) {
                url = '#/exam/research-activity/paper/' + resourceId + '/' + subject.id;
                window.open(url);
                return;
            }
            view = this.module.items['research-tips'];
            this.bindings.state.data.currentType = sectionType;
            this.module.dispatch('getResearchById', { id: resourceId }).then(function() {
                me.app.viewport.modal(view);
            });
        } else if (sectionType === 9) {
            // if (progress.finishStatus === 2) {
            //     url = '#/exam/exam/paper/' + resourceId;
            //     window.open(url);
            //     return;
            // }
            // view = this.module.items['exam-tips'];
            // this.bindings.state.examId = resourceId;
            // me.app.viewport.modal(view);
            me.app.viewport.modal(me.module.items['exam/exam/other-exam-prompt'], { examId: resourceId });
            return;
        } else {
            window.open(url);
        }
        // URL打开即完成
        if (sectionType === 3) {
            this.module.dispatch('updateProgress', {
                sectionId: id,
                beginTime: new Date().getTime(),
                clientType: 0,
                finishStatus: 2, // 已完成
                completedRate: 100, // 已完成
            });
        }
    },
    sectionDisplay: function(id) {
        var display = this.$('sectionDiv-' + id).style.display;
        if (display === 'none') {
            $(this.$('sectionDiv-' + id)).slideDown();
            $(this.$('icon-' + id)).removeClass('icon-triangle-down').addClass('icon-triangle-up');
            $(this.$('label-' + id)).html('收起');
        } else {
            $(this.$('sectionDiv-' + id)).slideUp();
            $(this.$('icon-' + id)).removeClass('icon-triangle-up').addClass('icon-triangle-down');
            $(this.$('label-' + id)).html('展开');
        }
    }
};

exports.dataForTemplate = {
    subject: function(data) {
        var subject = data.subject,
            progress = subject.studyProgress || {},
            state = data.state || {};
        util.rowHeader(subject.courseChapters, {
            after: '',
            before: '阶段'
        });
        // 计算剩余天数
        subject.studyDays = subject.studyDays ? subject.studyDays : 0;
        subject.restDays = 0;
        if (progress.createTime) {
            subject.restDays = util.restStudyDays(progress.createTime, subject.studyDays);
        }
        // var sections = this.bindings.subject.findAllSections();
        // var maxTime = _.max(sections, 'lastAccessTime');
        // console.log(maxTime);
        // 配置按钮地址
        subject.courseChapters = util.setBtn(subject.courseChapters,
          state.type,
          progress.currentSectionId);
        return subject;
    }
};
