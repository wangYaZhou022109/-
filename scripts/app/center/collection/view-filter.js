exports.bindings = {
    search: true
};

exports.dataForTemplate = {
    search: function(data) {
        var search = data.search;
        if (!search.businessType) search.typeAll = true;
        if (search.businessType === '1') search.typeCourse = true;
        if (search.businessType === '2') search.typeSubject = true;
        if (search.businessType === '3') search.typeExam = true;
        if (search.businessType === '4') search.typeClass = true;
        if (search.businessType === '5') search.typeLive = true;
        if (search.businessType === '6') search.typeTrain = true;
        if (search.businessType === '7') search.typeKnowledge = true;
        return search;
    }
};

exports.actions = {
    'click searchByName': 'search'
};

exports.events = {
    'click selectType-*': 'selectType',
    'click timeOrder': 'timeOrder'
};

exports.handlers = {
    selectType: function(businessType) {
        var params = {
            businessType: businessType === 'all' ? '' : businessType
        };
        this.module.dispatch('search', params);
    },
    timeOrder: function() {
        var timeOrder = this.bindings.search.data.timeOrder,
            params = {
                timeOrder: timeOrder === 'asc' ? 'desc' : 'asc'
            };
        this.module.dispatch('search', params);
    }
};
