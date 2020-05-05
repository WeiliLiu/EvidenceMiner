var elastic = require('../services/elasticsearch');

async function getSearchResults(req, res) {
    const q = req.query;
    const where = q.where? JSON.parse(q.where) : {};
    const sort = q.sort? JSON.parse(q.sort) : {};
    const select = q.select? JSON.parse(q.select) : {};
    const skip = q.skip? JSON.parse(q.skip) : 0;
    const limit = q.limit? JSON.parse(q.limit) : 10;
    const count = q.count? JSON.parse(q.count) : false;
    const includePreprint = q.includePreprint? JSON.parse(q.includePreprint) : false;
    const total = q.total? JSON.parse(q.total) : false;
    const index = q.index? JSON.parse(q.index) : "";

    if (count && total) return res.status(400).json({ message: "total and count can't be both true", data: {} });

    var sortList = [];
    Object.keys(sort).forEach(field => {
        if (sort[field] === 1) sortList.push({ [field]: { "order": "asc" } })
        if (sort[field] === -1) sortList.push({ [field]: { "order": "desc"} })
    })

    var fieldInList = [];
    var fieldExList = [];
    Object.keys(select).forEach(field => {
        if (select[field] === 1) fieldInList.push(field);
        if (select[field] === 0) fieldExList.push(field);
    })

    const query = {
        "_source": {
            "includes": fieldInList,
            "excludes": fieldExList
        },
        "sort": sortList,
        "query": {
            "bool": {
                "must": Object.entries(where).length === 0? 
                {
                    "match_all": {}
                } : 
                {
                    "match": where
                },
                "must_not": [
                    {
                        "term": {
                            "source": includePreprint? "" : "medrxiv"
                        }
                    },
                    {
                        "term": {
                            "source": includePreprint? "" : "biorxiv"
                        }
                    }
                ]
            }
        },
        "size": limit,
        "from": skip
    };
    
    const searchResults = await elastic.getDocuments(query, index)
        .then(response => {
            return {
                status: 200,
                ret: {
                    message: 'ok',
                    data: count? response.hits.hits.length : (total? response.hits.total.value : response)
                }
            };
        })
        .catch(error => {
            return {
                status: 400,
                ret: {
                    message: error.body.error.reason,
                    data: {}
                }
            };
        });
    
    return res.status(searchResults.status).json(searchResults.ret);
}
exports.getSearchResults = getSearchResults;