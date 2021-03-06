var $ = require('jquery');
exports.items = {
    'manage-tabs': 'manage-tabs',
    ordertime: 'main',
    classinfo: '',
    dateplan: '',
    quotamanage: '',
    publishnotice: '',
    membership: '',
    classmanage: '',
    evaluate: '',
    learneffect: '',
    trainsummary: '',
    'center/managements/weektopic': { isModule: true },
    'center/managements/addclass': { isModule: true },
    'center/managements/topic': { isModule: true },
    'center/managements/signup': { isModule: true },
    'center/managements/verify': { isModule: true },
    'center/managements/studentgroup': { isModule: true },
    'center/managements/entersituation': { isModule: true },
    'center/managements/addstudent': { isModule: true },
    'center/managements/watchexam': { isModule: true },
    'center/managements/taskdetail': { isModule: true },
    'center/managements/learndetail': { isModule: true },
    'center/managements/watchbring': { isModule: true },
    'center/managements/watchsurvey': { isModule: true },
    'center/managements/watchevaluate': { isModule: true },
    'center/managements/studentwatch': { isModule: true },
    'center/managements/addattendance': { isModule: true },
    'center/managements/attendancelist': { isModule: true },
    'center/managements/leave': { isModule: true },
    'center/managements/classedit': { isModule: true },
    'center/managements/count': { isModule: true },
    'center/managements/addtopicclass': { isModule: true },
    'center/managements/addwork': { isModule: true },
    'center/managements/addevaluation': { isModule: true },
    'center/managements/addexam2': { isModule: true },
    'center/managements/addunit': { isModule: true },
    'center/managements/addcarinfo': { isModule: true },
    'center/managements/choosedate': { isModule: true },
    'center/managements/stuname': { isModule: true }
};
exports.events = {
    'click managements-tab-*': 'showContents'
};

exports.handlers = {
    showContents: function(id) {
        $(this.$('managements-content-' + id)).toggle();
    }
};
