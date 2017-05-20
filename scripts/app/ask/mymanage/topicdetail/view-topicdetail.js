exports.type = 'dynamic';
exports.bindings = {
    topicdetail: true,
    down: false
};
exports.dataForTemplate = {
    // topicdetail: function(data) {
    //     // console.log(data);
    //     var obj = data,
    //         me = this;
    //     var url = obj.attachmentId;
    //     if (typeof url === 'undefined' || url === null || url === '') {
    //         obj.attachmentId = 'images/default-cover/default_topic.jpg';
    //     } else {
    //         obj.attachmentId = me.bindings.down.getFullUrl() + '?id=' + url;
    //     }
    // }
};

