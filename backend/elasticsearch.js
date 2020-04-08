const { Client } = require('@elastic/elasticsearch')

var elasticClient = new Client({
    node: 'http://localhost:9200'
});

var indexName = "evidenceminer";

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
        size: 2000,
        body: {
            "query": {
                "match": {
                    "searchKey": query
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

