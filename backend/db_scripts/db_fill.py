import json
import pymongo

def fill_db_with_entities(list_of_obj, collection, corpus):
    sentence_count = 0
    for obj in list_of_obj:
        entities = obj["entities"]
        for entity in entities:
            newEntity = {
                "name": entity["name"],
                "type": " ".join(entity["type"].split("_")),
                "source": "unkown",
                "start": entity["start"],
                "end": entity["end"],
                "docId": obj["documentId"],
                "sentId": sentence_count,
                "corpus": corpus
            }
            collection.insert_one(newEntity)
        sentence_count += 1

def decode_file_to_json(file_name):
    with open(file_name, 'r') as json_file:
        content = json_file.readlines()

    content = [x.strip() for x in content]

    json_object = []
    cnt = 0
    for object in content:
        if cnt == 10000:
            break
        curr_object = json.loads(object)
        json_object.append(curr_object)
        cnt += 1

    return json_object

def main():
    db_client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = db_client["em"]
    collection = db["entities"]
    print("connected to database...")
    obj = decode_file_to_json('chd_processed.json')
    print("data read...")
    # print(obj[0].keys())
    fill_db_with_entities(obj, collection, 'chd')

if __name__ == "__main__":
    main()