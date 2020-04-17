import axios from 'axios';

import config from './config';

const api = axios.create({ baseURL: config.searchUrl, headers: {
    "Content-Type": "application/json"
} });

export default {
    getSearchResult(keyword, size, page) {
        const query = {
            "query": {
                "match": { "searchKey": keyword }
            },
            "size": size,
            "from": (page - 1) * size
        };
        return api.get('/_search', {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(r => r.data)
    },
    getSearchResultCount(keyword) {
        const query = {
            "query": {
                "match": { "searchKey": keyword }
            },
            "size": 0
        };
        return api.get('/_search', {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
            .then(r => r.data.hits.total.value)
    },
};