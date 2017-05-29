exports.bindings = {
    researchRecord: true
};

exports.dataForTemplate = {
    memberTitle: function(data) { // 调研人/评估人
        var researchQuestionary = data.researchRecord.researchQuestionary || {};
        return researchQuestionary.type === 3 ? '评估人' : '调研人';
    }
};
