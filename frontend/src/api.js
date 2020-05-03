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
    }
};