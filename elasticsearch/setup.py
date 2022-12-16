from elasticsearch import Elasticsearch


if __name__ == '__main__':
    INDEX_NAME = "covid-19"
    NUMBER_SHARDS = 1 # keep this as one if no cluster
    NUMBER_REPLICAS = 0

    '''
    following is the defined schema
    '''
    base_properties = {
        "pmid": {
            "type": "keyword"
        },
        "sentId": {
            "type": "text"
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
            "type": "text"
        },
        "author_list": {
            "type": "text"
        },
        "journal_name": {
            "type": "keyword"
        },
        "mesh_heading": {
            "type": "text",
            "similarity": "BM25"
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
        },
        "documentId": {
            "type": "long"
        },
        "doi": {
            "type": "text"
        },
        "pmcid": {
            "type": "text"
        },
        "source": {
            "type": "text"
        },
        "sec_order": {
            "type": "text"
        }
    }

    request_body = {
        "settings": {
            "number_of_shards": NUMBER_SHARDS,
            "number_of_replicas": NUMBER_REPLICAS,
        },
        "mappings": {
            "properties": base_properties
        }
    }

    es = Elasticsearch("http://localhost:9200/")
    if es.indices.exists(INDEX_NAME):
        res = es.indices.delete(index = INDEX_NAME)
        print("Deleting index %s , Response: %s" % (INDEX_NAME, res))
    res = es.indices.create(index = INDEX_NAME, body = request_body)
    print("Create index %s , Response: %s" % (INDEX_NAME, res))