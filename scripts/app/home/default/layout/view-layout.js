var _ = require('lodash/collection'),
    maps = require('./app/util/maps'),
    D = require('drizzlejs');
exports.bindings = {
    contents: true,
    down: false,
    styleMap: false,
    course: true,
    subject: true,
    gensee: true,
    exam: true,
    research: true
};

exports.events = {
    'click more-*': 'more'
};

exports.handlers = {
    more: function(id) {
        this.app.navigate('home/more/layout/' + id, true);
    }
};

exports.dataForTemplate = {
    moduleHomeConfig: function(data) {
        var moduleHomeConfig = data.moduleHomeConfig || {};
        moduleHomeConfig = this.module.renderOptions.moduleHomeConfig;
        return moduleHomeConfig;
    },
    contents: function(data) {
        var array = {},
            size,
            styleMap = this.bindings.styleMap.data,
            downUrl = this.bindings.down.getFullUrl(),
            courseData = this.bindings.course.data || [],
            subjectData = this.bindings.subject.data || [],
            examData = this.bindings.exam.data || [],
            researchData = this.bindings.research.data || [],
            genseeData = this.bindings.gensee.data || [];
        // 拼接课程
        if (courseData.length > 0) {
            _.map(data.contents, function(content) {
                var course = _.find(courseData, ['id', content.dataId]);
                if (course) {
                    D.assign(content, {
                        dataId: course.id,
                        dataName: course.name,
                        dataSummary: course.description || '',
                        browseCount: course.visits || 0,
                        beginTime: course.beginDate,
                        endTime: course.endDate,
                        dataImage: course.cover
                    });
                }
            });
        }
        // 拼接专题
        if (subjectData.length > 0) {
            _.map(data.contents, function(content) {
                var subject = _.find(subjectData, ['id', content.dataId]);
                if (subject) {
                    D.assign(content, {
                        dataId: subject.id,
                        dataName: subject.name,
                        dataSummary: subject.description || '',
                        browseCount: subject.visits || 0,
                        beginTime: subject.beginDate,
                        endTime: subject.endDate,
                        dataImage: subject.cover
                    });
                }
            });
        }
        // 拼接考试
        if (examData.length > 0) {
            _.map(data.contents, function(content) {
                var exam = _.find(examData, ['id', content.dataId]);
                if (exam) {
                    D.assign(content, {
                        dataId: exam.id,
                        dataName: exam.name,
                        dataSummary: exam.examNotes || '',
                        browseCount: exam.applicantNumber || 0,
                        beginTime: exam.startTime,
                        endTime: exam.endTime,
                        dataImage: exam.cover
                    });
                }
            });
        }
        // 拼接调研
        if (researchData.length > 0) {
            _.map(data.contents, function(content) {
                var research = _.find(researchData, ['id', content.dataId]);
                if (research) {
                    D.assign(content, {
                        dataId: research.id,
                        dataName: research.name,
                        dataSummary: research.questionaryDetail || '',
                        browseCount: 0,
                        beginTime: research.startTime,
                        endTime: research.endTime,
                        dataImage: research.cover
                    });
                }
            });
        }
        // 拼接直播
        if (genseeData.length > 0) {
            _.map(data.contents, function(content) {
                var gensee = _.find(genseeData, ['id', content.dataId]);
                if (gensee) {
                    D.assign(content, {
                        dataId: gensee.id,
                        dataName: gensee.subject,
                        dataSummary: gensee.genseeDesc || '',
                        browseCount: gensee.attendNumber,
                        beginTime: gensee.startTime,
                        endTime: gensee.endTime,
                        dataImage: gensee.cover
                    });
                }
            });
        }
        _.map(data.contents, function(content, i) {
            var r = content,
                imageUrl = maps['home-default-image'][r.dataType],
                dataUrl = maps['home-data-url'][r.dataType];
            if (r.dataImage) {
                imageUrl = downUrl + '?id=' + r.dataImage;
            }
            if (r.image) {
                imageUrl = downUrl + '?id=' + r.image;
            }
            r.browseCount = r.browseCount || 0;
            r.imageUrl = imageUrl;
            r.dataUrl = dataUrl + r.dataId;
            array[i + 1] = r;
        });
        array.length = data.contents.length;
        if (array.length > 0) {
            size = styleMap[data.moduleHomeConfig.style || 7];
            if (array.length === size) {
                array.more = true;
            }
        }
        return array;
    }
};
