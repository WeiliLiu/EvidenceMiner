import axios from 'axios';

import config from './config';

const api = axios.create({ baseURL: config.searchUrl, headers: {
    "Content-Type": "application/json"
} });

export default {
    getSearchResult(keyword, size, page, archive, includePreprint) {
        const query = {
            "query": {
                "bool": {
                    "must": {
                        "match": { "searchKey": keyword }
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
            "size": size,
            "from": (page - 1) * size
        };
        return api.get(`/${archive}/_search`, {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(r => r.data)
    },
    getSearchResultCount(keyword, archive, includePreprint) {
        const query = {
            "query": {
                "bool": {
                    "must": {
                        "match": { "searchKey": keyword }
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
            "size": 0
        };
        return api.get(`/${archive}/_search`, {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(r => r.data.hits.total.value)
    },
    getDocSentences(docId, size, archive) {
        const query = {
            "query": {
                "match": {"documentId": docId}
            },
            "from": 0,
            "size": size,
        };
        return api.get(`/${archive}/_search`, {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(r => r.data)
    },
    getDocSentencesCount(docId, archive) {
        const query = {
            "query": {
                "match": {"documentId": docId}
            },
            "from": 0,
            "size": 0,
        };
        return api.get(`/${archive}/_search`, {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(r => r.data.hits.total.value)
    },
    getAutoComplete(value, archive) {
        const query = {
            "query": {
                "multi_match": {
                    "query": value,
                    "type": "bool_prefix",
                    "fields": [
                        "metaPattern",
                        "metaPattern._2gram",
                        "metaPattern._3gram"
                    ]
                }
            }
        };

        return api.get(`/${archive}/_search`, {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(r => r.data.hits.hits)
    },
    getTopRecord(corpus, type){
        const query = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "type": type.toUpperCase() } },
                        { "match": { "corpus": corpus } }
                    ]
                }
            },
            "size": 1,
            "from":0
        };
        return api.get(`/top/_search`, {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(r => r.data)
    },
    getPatternFilteredByDocCount(corpus, type, constrain){
        const query = {
            "sort" : [
                {"docCount" : {"order":"desc"}}
            ],
            "query": {
                "bool": {
                    "must": [
                        { "match": { "type": type.toUpperCase() } },
                        { "match": { "corpus": corpus } },
                        { "match": { "instance": constrain.toLowerCase() } }
                    ]
                }
            },
            "size" :20,
            "from":0
        };
        return api.get(`/pattern/_search`, {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(r => r.data)
    },
    getPatternFilteredBysentCount(corpus, type, constrain){
        const query = {
            "sort" : [
                {"sentCount" : {"order":"desc"}}
            ],
            "query": {
                "bool": {
                    "must": [
                        { "match": { "type": type.toUpperCase() } },
                        { "match": { "corpus": corpus } },
                        { "match": { "instance": constrain.toLowerCase()} }
                    ]
                }
            },
            "size" :20,
            "from":0
        };
        return api.get(`/pattern/_search`, {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(r => r.data)
    }
};