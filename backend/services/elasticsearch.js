var elasticsearch = require('elasticsearch');
var config = require('../config');

var elasticClient = new elasticsearch.Client({
    host: config.elasticsearchUrl,
    log: 'info'
});

async function getDocuments(queryBody, index) {
    const searchResult = await elasticClient.search({
        index: index,
        body: queryBody
    });
    return searchResult;
}
exports.getDocuments = getDocuments;