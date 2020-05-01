import time
import json
from elasticsearch import Elasticsearch
import re

if __name__ == '__main__':
    inputFilePath = "./covid19_processed.json"
    logFilePath = "./es_log.txt"

    INDEX_NAME = "covid-19"

    es = Elasticsearch("http://localhost:9200/")

    with open(inputFilePath, "r") as fin, open(logFilePath, "w") as fout:
        start = time.time()
        bulk_size = 100 # number of document processed in each bulk index
        bulk_data = [] # data in bulk index

        cnt = 0
        for line in fin: ## each line is single document
            # if cnt == 200:
            #     break
            cnt += 1
            paperInfo = json.loads(line.strip())
            
            data_dict = {}
            
            # update PMID
            data_dict["pmid"] = paperInfo.get("pmid", "-1")

            # update sentId
            data_dict["sentId"] = paperInfo.get("sentId", "-1")

            # update entities
            data_dict["entities"] = paperInfo.get("entities", "[]")

            # update isTitle
            data_dict["isTitle"] = paperInfo.get("isTitle", "False")

            # update title
            data_dict["title"] = paperInfo.get("title", "")

            # update sentence
            data_dict["sentence"] = paperInfo.get("sentence", "")

            # update patterns
            data_dict["patterns"] = paperInfo.get("patterns", [])

            # update searchKey
            data_dict["searchKey"] = paperInfo.get("searchKey", "")

            # update metaPattern
            data_dict["metaPattern"] = paperInfo.get("metaPattern", "")

            # update prevSent
            data_dict["prevSent"] = paperInfo.get("prevSent", "")

            # update nextSent
            data_dict['nextSent'] = paperInfo.get("nextSent", "")

            # update mesh_heading
            data_dict["mesh_heading"] = " ".join(paperInfo.get("mesh_heading", []))

            # update journal name
            data_dict["journal_name"] = paperInfo.get("journal_name", "No Journal Name")

            # update author list
            data_dict["author_list"] = paperInfo.get("author_list", [])

            # update documentId
            data_dict["documentId"] = paperInfo.get("documentId", -1)
            
            # update doi
            data_dict["doi"] = paperInfo.get("doi", "")

            # update pmcid
            data_dict["pmcid"] = paperInfo.get("pmcid", "")

            # update source
            data_dict["source"] = paperInfo.get("source", "")

            # update the section order
            data_dict["sec_order"] = paperInfo.get("sec_order", [])

            # update date
            if isinstance(paperInfo["date"], str):
                data_dict["date"] = paperInfo["date"]
            elif isinstance(paperInfo["date"], int):
                data_dict["date"] = str(paperInfo["date"])
            else:
                # print(paperInfo["PubDate"])
                if paperInfo["date"]["Year"]:
                    if len(paperInfo["date"]["Year"]) != 4 or paperInfo["date"]["Year"].isdigit() == False:
                        data_dict["date"] = -1
                    else:
                        data_dict["date"] = int(paperInfo["date"]["Year"])
                elif paperInfo["date"]["MedlineDate"]:
                    m = re.search(r".*?(\d\d\d\d).*?", paperInfo["date"]["MedlineDate"])
                    if m:
                        data_dict["date"] = int(m.group(1))
                    else:
                        data_dict["date"] = -1
                else:
                    data_dict["date"] = -1

            # update journal name
            data_dict["journal_name"] = paperInfo.get("journal_name", "No journal info")
            if isinstance(data_dict["journal_name"], int):
                data_dict["journal_name"] = "No journal info"
            
            ## Put current data into the bulk
            op_dict = {
                "index": {
                    "_index": INDEX_NAME,
                }
            }

            bulk_data.append(op_dict)
            bulk_data.append(data_dict)       
                    
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