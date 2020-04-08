import time
import json
from collections import defaultdict
from elasticsearch import Elasticsearch

if __name__ == '__main__':
    # inputFilePath = "../data/CORD-19-NER/2020-03-13/COVID-19-corpus-ner-merged.json"
    # typeFilePath = "../data/CORD-19-NER/2020-03-13/type_list.txt"
    # logFilePath = "../data/CORD-19-NER/2020-03-13/log_20200330.txt"
    # statFilePath = "../data/CORD-19-NER/2020-03-13/stats_20200330.txt"
    inputFilePath = "./pubmed_with_pattern.json"
    logFilePath = "./es_log.txt"

    INDEX_NAME = "evidenceminer"
    # TYPE_NAME = "covid19_0313"

    # type_list = []
    # with open(typeFilePath, "r") as fin:
    #     for line in fin:
    #         line = line.strip().lower()
    #         if line and line != "date":
    #             type_list.append(line)


    es = Elasticsearch()

    with open(inputFilePath, "r") as fin, open(logFilePath, "w") as fout:
        start = time.time()
        bulk_size = 100 # number of document processed in each bulk index
        bulk_data = [] # data in bulk index
        
        ## saving the sum of all field lengths for later model usage
        # length_dict = {
        #     "title_length_sum": 0,
        #     "abstract_length_sum": 0,
        #     "total_length_sum": 0,
        #     "full_text_length_sum": 0
        # }
        # for entity_type in type_list:
        #     length_dict[entity_type+"_length_sum"] = 0

        cnt = 0
        for line in fin: ## each line is single document
            if cnt == 1:
                break
            cnt += 1
            paperInfo = json.loads(line.strip())
            
            data_dict = {}
            # total_length = 0
            
            # update PMID
            data_dict["pmid"] = paperInfo.get("PMID", "-1")

            # update sentId
            data_dict["sentId"] = paperInfo.get("sentId", "-1")

            # update entities
            data_dict["entities"] = paperInfo.get("entities", "[]")

            # update isTitle
            data_dict["isTitle"] = paperInfo.get("isTitle", "False")

            # update title
            data_dict["title"] = paperInfo.get("title", "")

            # update PMID
            data_dict["pmid"] = paperInfo.get("PMID", "-1")

            # update sentence
            data_dict["sentence"] = paperInfo.get("sentence", "")

            #  update entities
            data_dict["entities"] = paperInfo.get("entities", "[]")

            # update patterns
            data_dict["patterns"] = paperInfo.get("pattern", "[]")

            # update searchKey
            data_dict["searchKey"] = paperInfo.get("searchKey", "")

            # update metaPattern
            data_dict["metaPattern"] = paperInfo.get("metaPattern", "")

            # update prevSent
            data_dict["prevSent"] = paperInfo.get("prevSent", "")

            # update nextSent
            data_dict['nextSent'] = paperInfo.get("nextSent", "")

            # update mesh_heading
            data_dict["mesh_heading"] = " ".join(paperInfo["MeshHeadingList"])

            # update journal name
            data_dict["journal_name"] = paperInfo.get("Journal", "No Journal Name")

            # update author list
            if paperInfo["AuthorList"]:
                author_list = []
                for author in paperInfo["AuthorList"]:
                    collective_name = author.get("CollectiveName", "")
                    if collective_name:
                        author_list.append(collective_name)
                    else:
                        author_name = author.get("ForeName", "") + ", " + author.get("LastName", "")
                        author_list.append(author_name)
                data_dict["author_list"] = author_list
            else:
                data_dict["author_list"] = []
            
            # update date
            # print(cnt)
            if paperInfo["PubDate"]["Year"]:
                if len(paperInfo["PubDate"]["Year"]) != 4 or paperInfo["PubDate"]["Year"].isdigit() == False:
                    data_dict["date"] = "No Year"
                else:
                    data_dict["date"] = int(paperInfo["PubDate"]["Year"])
            elif paperInfo["PubDate"]["MedlineDate"]:
                m = re.search(r".*?(\d\d\d\d).*?", paperInfo["PubDate"]["MedlineDate"])
                if m:
                    data_dict["date"] = int(m.group(1))
                else:
                    data_dict["date"] = -1
            else:
                data_dict["date"] = -1

            # update journal name
            data_dict["journal_name"] = paperInfo.get("journal", "No journal info")
            if isinstance(data_dict["journal_name"], int):
                data_dict["journal_name"] = "No journal info"
            
            ## Put current data into the bulk
            op_dict = {
                "index": {
                    "_index": INDEX_NAME,
                    "_type": 'doc',
                    "_id": cnt
                }
            }

            bulk_data.append(op_dict)
            bulk_data.append(data_dict)       
            print(bulk_data)
                    
            ## Start Bulk indexing
            if cnt % bulk_size == 0 and cnt != 0:
                tmp = time.time()
                res = es.bulk(index=INDEX_NAME, body=bulk_data, request_timeout = 360)
                # print(res)
                fout.write("bulk indexing... %s, escaped time %s (seconds) \n" % ( cnt, tmp - start ) )
                print("bulk indexing... %s, escaped time %s (seconds) " % ( cnt, tmp - start ) )
                bulk_data = []
        
        ## indexing those left papers
        if bulk_data:
            tmp = time.time()
            es.bulk(index=INDEX_NAME, body=bulk_data, request_timeout = 360)
            fout.write("bulk indexing... %s, escaped time %s (seconds) \n" % ( cnt, tmp - start ) )
            print("bulk indexing... %s, escaped time %s (seconds) " % ( cnt, tmp - start ) )
            bulk_data = []

        end = time.time()
        fout.write("Finish indexing. Total escaped time %s (seconds) \n" % (end - start) )
        print("Finish indexing. Total escaped time %s (seconds) " % (end - start) )