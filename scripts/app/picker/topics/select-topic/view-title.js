exports.actions = {
    'keyup searchTopic': 'refreshList'
};

exports.dataForActions = {
    refreshList: function(data, e) {
        if (e.keyCode !== 13) return false;
        return data;
    }
};

