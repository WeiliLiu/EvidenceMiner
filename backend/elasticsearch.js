const { Client } = require('@elastic/elasticsearch')

var elasticClient = new Client({
    node: 'http://localhost:9200'
});

var indexName = "evidenceminer";

/**
 * Delete an existing index
 */
function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName,
    });
}
exports.deleteIndex = deleteIndex;

/**
 * Create an index
 */
function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
 * Check for the existence of an index
 */
function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

/**
 * Initialize the mapping for the index
 */
function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        "settings" : {
            "index" : {
                "number_of_shards" : 12, 
                "number_of_replicas" : 2 
            }
        },
        type: "document",
        body: {
            properties: {
                "pmid": {
                    "type": "keyword"
                },
                "sentId": {
                    "type": "long"
                },
                "entities": {
                    "type": "object"
                },
                "isTitle": {
                    "type": "long"
                },
                "title": {
                    "type": "text"
                },
                "prevSent": {
                    "type": "text"
                },
                "nextSent": {
                    "type": "text"
                },
                "date": {
                    "type": "long"
                },
                "author_list": {
                    "type": "keyword"
                },
                "journal_name": {
                    "type": "keyword"
                },
                "mesh_heading": {
                    "type": "text",
                    "similarity": "BM25",
                },
                "sentence":{
                    "type": "text"
                },
                "patterns":{
                    "type": "object"
                },
                "searchKey": {
                    "type": "text",
                    "similarity": "BM25",
                },
                "metaPattern": {
                    "type": "search_as_you_type"
                }
            }
        }
    });
}
exports.initMapping = initMapping;

/**
 * Add a document to the index
 */
function addDocument(document) {
    // console.log("indexing document")
    // console.log(document);
    return elasticClient.index({
        index: indexName,
        body: {
            pmid: document.pmid,
            sentId: document.sentId,
            entities: document.entities,
            isTitle: document.isTitle,
            title: document.title,
            prevSent: document.prevSent,
            nextSent: document.nextSent,
            date: document.date,
            author_list: document.author_list,
            journal_name: document.journal_name,
            mesh_heading: document.mesh_heading,
            sentence: document.sentence,
            patterns: document.patterns,
            searchKey: document.searchKey,
            metaPattern: document.metaPattern
        }
    });
}
exports.addDocument = addDocument;

/**
 * Search for documents
 */
function getSearchResult(query) {
    return elasticClient.search({
        index: indexName,
        from: 0,
        size: 10,
        body: {
            "query": {
                "bool": {
                    "should": [
                        {
                            "match": {
                                "searchKey": query
                            }
                        }
                    ]
                }
            }
        }
    }, {
        ignore: [404],
        maxRetries: 3
    })
}
exports.getSearchResult = getSearchResult;

/**
 * Get completion suggestions given an input string
 */
function getSuggestions(input) {
    return elasticClient.Suggest({
        index: indexName,
        type: "document",
        body: {
            docsuggest: {
                text: input,
                completion: {
                    field: "suggest",
                    fuzzy: true
                }
            }
        }
    })
}
exports.getSuggestions = getSuggestions;

