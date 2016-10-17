var infoData = {
    copyRight: 'CopyRight © 2016 zhixueyun.com All Rights Reserved 版权所有 深圳知学云科技有限公司'
};

exports.items = {
    bottom: 'bottom'
};

exports.store = {
    models: {
        information: { data: infoData }
    },

    callbacks: {
        'app.pushState': function() {

        }
    }
};
