from elasticsearch import Elasticsearch


if __name__ == '__main__':
    INDEX_NAME = "evidenceminer"
    # TYPE_NAME = "covid19_0313"
    NUMBER_SHARDS = 1 # keep this as one if no cluster
    NUMBER_REPLICAS = 0

    # type_list = []
    # with open("/home/ubuntu/Oxygen/data/CORD-19-NER/2020-03-13/type_list.txt", "r") as fin:
    #     for line in fin:
    #         line = line.strip().lower()
    #         if line and line != "date":
    #             type_list.append(line)
    
    # print(f"{len(type_list)} entity types in total")
    '''
    following is the defined schema
    '''
    base_properties = {
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
            "type": "boolean"
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
            "similarity": "BM25"
        },
        "sentence":{
            "type": "text"
        },
        "patterns":{
            "type": "object"
        },
        "searchKey": {
            "type": "keyword"
        },
        "metaPattern": {
            "type": "search_as_you_type"
        }
    }

    request_body = {
        "settings": {
            "number_of_shards": NUMBER_SHARDS,
            "number_of_replicas": NUMBER_REPLICAS,
            # "index": {
            #     "similarity": {
            #         "dirichlet_lm": {
            #             "type": "LMDirichlet",
            #             "mu": 2000
            #         }
            #     }
            # }
        },
        "mappings": {
            "properties": base_properties
        }
    }

    es = Elasticsearch()
    if es.indices.exists(INDEX_NAME):
        res = es.indices.delete(index = INDEX_NAME)
        print("Deleting index %s , Response: %s" % (INDEX_NAME, res))
    res = es.indices.create(index = INDEX_NAME, body = request_body)
    print("Create index %s , Response: %s" % (INDEX_NAME, res))