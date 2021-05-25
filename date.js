exports.GetDate = function() {
var today = new Date();
    //var CurrentDay = today.getDay();
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var day = today.toLocaleDateString(undefined, options);
    return day;
}

exports.GetDay = function() {
    var today = new Date();
        //var CurrentDay = today.getDay();
        
        const options = { weekday: 'long' };
        var day = today.toLocaleDateString(undefined, options);
        return day;
    }