var _ = require('lodash/collection'),
    D = require('drizzlejs'),
    maps = require('./app/util/maps'),
    getRemoteMarkConfig,
    suppleMarkConfig,
    checkMarkConfig,
    groupCollection;

getRemoteMarkConfig = function(paperClass) {
    var map = {},
        data = {
            isPaper: true,
            isQuestionType: false,
            isQuestion: false,
            markPapers: [{ id: paperClass.id, name: paperClass.name, markMembers: [] }],
            markQuestionTypes: [],
            markQuestions: []
        };

    if (paperClass.paperClassQuestions.length > 0) {
        _.forEach(_.filter(_.map(paperClass.paperClassQuestions, function(q) {
            return {
                id: q.question.type,
                name: _.find(maps.get('question-types'), ['key', q.question.type.toString()]).value,
                markMembers: []
            };
        }), function(q) {
            return q.id === 4 || q.id === 5 || q.id === 6;
        }), function(mq) {
            map[mq.name] = mq;
        });

        _.forEach(map, function(o) {
            data.markQuestionTypes.push(o);
        });
        data.markQuestions = _.filter(_.map(paperClass.paperClassQuestions, function(q) {
            return { id: q.question.id, name: q.question.content, markMembers: [], type: q.question.type };
        }), function(q) {
            return q.type === 4 || q.type === 5 || q.type === 6;
        });
    } else if (paperClass.paperClassTactics.length > 0) {
        data.markQuestionTypes = _.map(_.filter(paperClass.paperClassTactics, function(pt) {
            return pt.type === 4 || pt.type === 5 || pt.type === 6;
        }), function(q) {
            return {
                id: q.type,
                name: maps.get('question-types')[Number(q.type) - 1].value,
                markMembers: []
            };
        });
    }
    return data;
};

suppleMarkConfig = function(markConfig, paperClass) {
    var remoteMarkConfig,
        mc = markConfig;

    remoteMarkConfig = getRemoteMarkConfig(paperClass);
    if (!D.isArray(mc)) {
        mc.markPapers = _.map(remoteMarkConfig.markPapers, function(mp) {
            var o = _.find(mc.markPapers, ['id', mp.id]);
            if (o) {
                o.name = mp.name;
                return o;
            }
            return mp;
        });
        mc.markQuestionTypes = _.map(remoteMarkConfig.markQuestionTypes, function(mqt) {
            var o = _.find(mc.markQuestionTypes, ['id', mqt.id]);
            if (o) {
                o.name = mqt.name;
                return o;
            }
            return mqt;
        });
        mc.markQuestions = _.map(remoteMarkConfig.markQuestions, function(mq) {
            var o = _.find(mc.markQuestions, ['id', mq.id]);
            if (o) {
                o.name = mq.name;
                return o;
            }
            return mq;
        });
        return mc;
    }
    return remoteMarkConfig;
};

checkMarkConfig = function(markConfig) {
    var result = {},
        markPapers, markQuestionTypes, markQuestions;

    if (D.isString(markConfig)) {
        return JSON.parse(markConfig);
    }

    if (markConfig && D.isArray(markConfig) && markConfig.length > 0) {
        markPapers = _.filter(markConfig, function(m) {
            return m.type === 1;
        });
        markQuestionTypes = _.filter(markConfig, function(m) {
            return m.type === 2;
        });
        markQuestions = _.filter(markConfig, function(m) {
            return m.type === 3;
        });

        result.markPapers = _.map(groupCollection(markPapers, 'typeId'), function(papers) {
            return {
                id: papers[0].typeId,
                markMembers: _.map(papers, function(p) {
                    return {
                        id: p.member.id,
                        name: p.member.name
                    };
                })
            };
        });

        result.markQuestionTypes = _.map(groupCollection(markQuestionTypes, 'typeId'), function(questionTypes) {
            return {
                id: Number(questionTypes[0].typeId),
                markMembers: _.map(questionTypes, function(qt) {
                    return {
                        id: qt.member.id,
                        name: qt.member.name
                    };
                })
            };
        });

        result.markQuestions = _.map(groupCollection(markQuestions, 'typeId'), function(questions) {
            return {
                id: questions[0].typeId,
                markMembers: _.map(questions, function(q) {
                    return {
                        id: q.member.id,
                        name: q.member.name
                    };
                })
            };
        });

        return result;
    }
    return markConfig;
};

groupCollection = function(collection, field) {
    var result = {},
        array = [];
    _.forEach(collection, function(c) {
        if (!result[c[field]]) {
            result[c[field]] = { key: c[field], value: [] };
            result[c[field]].value.push(c);
        } else {
            result[c[field]].value.push(c);
        }
    });
    _.forEach(result, function(r) {
        array.push(r.value);
    });
    return array;
};


module.exports = {
    covertMarkConfig: function(m, p) {
        return suppleMarkConfig(checkMarkConfig(m), p);
    },
    getRemoteMarkConfig: function(p) {
        return getRemoteMarkConfig(p);
    }
};
