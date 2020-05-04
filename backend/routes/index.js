// Connect all api endpoints here
module.exports = function(app, router) {
    app.use('/api', require('./home')(router));

    // search route
    var search = require('./search');
    app.route('/api/search')
        .get(search.getSearchResults);
};