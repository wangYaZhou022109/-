//  传进来的值 例如  1.0 -> 1  1.2 -> 1.2
var round = function(n) {
    var str = n + '',
        arr = str.split('.');
    return Number(arr[1]) === 0 ? Number(arr[0]) : str;
};

exports.round = round;
