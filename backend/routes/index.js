// Connect all api endpoints here
module.exports = function(app, router) {
    app.use('/api', require('./home')(router));

    // search route
    var search = require('./search');
    app.route('/api/search')
        .get(search.getSearchResults);

    // entity route
    var entities = require('./entities');
    app.route('/api/entities')
        .get(entities.getEntities)
};