var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    traineeGroups: true,
    classstaffs: true
};

exports.dataForTemplate = {
    traineeGroups: function(data) {
        var traineeGroups = data.traineeGroups;
        traineeGroups = _.filter(traineeGroups, function(tg) {
            if (tg.traineeList && tg.traineeList.length > 0) {
                return true;
            }
            return false;
        });
        return traineeGroups;
    }
};

exports.events = {
    'click checkAllTrainee': 'checkAllTrainee',
    'click checkGroup*': 'checkGroup',
    'click trainee-*': 'checkTrainee',
    'click checkAllStaff': 'checkAllStaff',
    'click classstaff-*': 'checkClassstaff'
};

exports.handlers = {
    checkAllTrainee: function(events, obj) {
        var checkGroup = $(this.$$('[name="checkGroup"]')),
            trainees = $(this.$$('[name="trainee"]'));
        checkGroup.each(function() {
            $(this).prop('checked', obj.checked);
        });
        if (obj.checked) {
            trainees.each(function() {
                $(this).addClass('active');
            });
        } else {
            trainees.each(function() {
                $(this).removeClass('active');
            });
        }
    },
    checkGroup: function(id, events, obj) {
        var div = $(obj).parent().parent(),
            trainees = div.next().children(),
            checkAll = $(this.$$('[name="checkAllTrainee"]')),
            checkGroup = $(this.$$('[name="checkGroup"]')),
            checkGroupTrue;
        if (obj.checked) {
            $(trainees).each(function() {
                $(this).addClass('active');
            });
        } else {
            $(trainees).each(function() {
                $(this).removeClass('active');
            });
        }
        checkGroupTrue = $(this.$$('[name="checkGroup"]:checked'));
        checkAll.prop('checked', checkGroup.length === checkGroupTrue.length);
    },
    checkTrainee: function(id, events, obj) {
        var parent = $(obj).parent(),
            length = parent.children().length,
            activeLength,
            div = parent.prev().children().eq(1),
            input = div.children('input'),
            checkAll = $(this.$$('[name="checkAllTrainee"]')),
            checkGroup = $(this.$$('[name="checkGroup"]')),
            checkGroupTrue;
        $(obj).toggleClass('active');
        activeLength = parent.children('.active').length;
        input.prop('checked', length === activeLength);
        checkGroupTrue = $(this.$$('[name="checkGroup"]:checked'));
        checkAll.prop('checked', checkGroup.length === checkGroupTrue.length);
    },
    checkAllStaff: function(events, obj) {
        var classstaffs = $(this.$$('[name="classstaff"]'));
        if (obj.checked) {
            classstaffs.each(function() {
                $(this).addClass('active');
            });
        } else {
            classstaffs.each(function() {
                $(this).removeClass('active');
            });
        }
    },
    checkClassstaff: function(id, events, obj) {
        var length = $(this.$$('[name="classstaff"]')).length,
            checkAllStaff = $(this.$$('[name="checkAllStaff"]')),
            activeLength;
        $(obj).toggleClass('active');
        activeLength = $(obj).parent().children('.active').length;
        checkAllStaff.prop('checked', length === activeLength);
    }
};
