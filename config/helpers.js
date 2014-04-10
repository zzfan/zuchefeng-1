exports.yyyymmdd = function() {
    return (new Date()).toISOString().slice(0,10);
};

exports.yyyymmdd1 = function() {
    var today = new Date();
    var tomorrow = new Date(today.getTime()+(24*60*60*1000));
    return tomorrow.toISOString().slice(0,10);
};
