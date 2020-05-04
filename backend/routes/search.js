var elastic = require('../services/elasticsearch');

async function getSearchResults(req, res) {
    const keyword = "sars-cov-2 masks";
    const query = {
        "query": {
            "bool": {
                "must": {
                    "match": { "searchKey": keyword }
                }
            }
        },
        "size": 0
    };
    const searchResults = await elastic.getDocuments(query, 'covid-19');
    return res.status(200).json({
        message: 'ok',
        data: searchResults
    });
}
exports.getSearchResults = getSearchResults;