import json
import nltk.data
import ast

def decode_file_to_json(file_name):
    with open(file_name) as json_file:
        content = json_file.readlines()

    content = [x.strip() for x in content]

    json_object = []
    for object in content:
        curr_object = json.loads(object)
        json_object.append(curr_object)

    return json_object

def process_sentences(sentences, doc, start, id_start, isTitle, whole_text, prevNumSent, patterns):
    ret = []
    start_store = start
    for sentence in sentences:
        # Inialize an empty object
        currObj = {}
        # Store the PMID 
        currObj['pmid'] = doc['PMID']

        currObj['isTitle'] = isTitle

        # Store the sentence itself for display purposes
        currObj['sentence'] = sentence

        # Store the title even if it is the current sentence
        currObj['title'] = doc['ArticleTitle']

        # Journal may not exist in the provided data, so need to check for existence
        if 'Journal' in doc:
            currObj['journal_name'] = doc['Journal']
        else:
            currObj['journal_name'] = "Unknown"

        # Store the current sentence id
        if isTitle == 0:
            currObj['sentId'] = 'abstract' + str(id_start)
        elif isTitle == 1:
            currObj['sentId'] = 'title' + str(id_start)
        else:
            currObj['sentId'] = 'body' + str(id_start)

        # Filter out the entities relevant to the current sentence and store it in the object
        currObj['searchKey'] = sentence
        currObj['entities'] = []
        sentence_local_start = whole_text.find(sentence)
        for entity in doc['entity']:
            if entity['start'] >= (start_store + sentence_local_start) and entity['start'] < (start_store + sentence_local_start + len(sentence)):
                entity['start'] -= (start_store + sentence_local_start)
                entity['end'] -= (start_store + sentence_local_start)
                entity_type_strings = entity['type'].split('_')
                entity['type'] = ' '.join(entity['type'].split('_'))
                currObj['entities'].append(entity)
                currObj['searchKey'] += ' '
                currObj['searchKey'] += entity['name']
                currObj["metaPattern"] = ""

        # set up pattern for current sentence
        currObj['patterns'] = []
        for pattern in patterns:
            if id_start + prevNumSent == int(pattern['sentID']):
                temp_pattern = pattern.copy()
                if isTitle == 0:
                    temp_pattern['sentID'] = 'abstract' + str(id_start)
                elif isTitle == 1:
                    temp_pattern['sentID'] = 'title' + str(id_start)
                else:
                    temp_pattern['sentID'] = 'body' + str(id_start)
                currObj['patterns'].append(temp_pattern)
                currObj['searchKey'] += ' '
                currObj['searchKey'] += pattern['sentenceExtraction'].replace('{', '').replace('}', '').replace('_', ' ')
                currObj['searchKey'] += ' '
                currObj['searchKey'] += pattern['metaPattern']
                currObj['metaPattern'] = pattern['metaPattern']

        # Get Previous Sentence and store it
        if id_start == 0:
            currObj['prevSent'] = ""
        elif id_start == 1:
            currObj['prevSent'] = sentences[id_start - 1]
        else:
            currObj['prevSent'] = '... ' + sentences[id_start - 1]

        # Get Next Sentence and store it
        if id_start == len(sentences) - 1:
            currObj['nextSent'] = ""
        elif id_start == len(sentences) - 2:
            currObj['nextSent'] = sentences[id_start + 1]
        else:
            currObj['nextSent'] = sentences[id_start + 1] + ' ...'

        # Store the publication date directly
        currObj['date'] = doc['PubDate']

        # Check if meshheadinglist exists and store it
        if 'MeshHeadingList' in doc:
            currObj['mesh_heading'] = doc['MeshHeadingList']
        else:
            currObj['mesh_heading'] = []

        # Check if authorlist exists and store it
        if "AuthorList" in doc:
            author_list = []
            # check if AuthorList is a string or list
            if isinstance(doc["AuthorList"], int):
                author_list = []
            elif isinstance(doc["AuthorList"], unicode):
                if ';' in doc["AuthorList"]:
                    for author in doc["AuthorList"].split(';'):
                        author_list.append(author)
                else:
                    try:
                        author_list = ast.literal_eval(doc["AuthorList"])
                    except:
                        author_list = [doc["AuthorList"]]
            else:
                for author in doc["AuthorList"]:
                    collective_name = author.get("CollectiveName", "")
                    if collective_name:
                        author_list.append(collective_name)
                    else:
                        author_name = author.get("ForeName", "") + ", " + author.get("LastName", "")
                        author_list.append(author_name)
            currObj["author_list"] = author_list
        else:
            currObj["author_list"] = []

        # Store the unique id of the document the sentence belongs to
        currObj["documentId"] = doc["id"]

        # Append the object into the array
        ret.append(json.dumps(currObj) + '\n')

        # Increment the necessary variables
        id_start += 1 

    return ret

def combine_objects(pubmed_obj, pubmed_pattern_obj):
    # Initialize the tokenizer from nltk package
    tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

    # Inialize the object to return
    combined_obj = []

    # Iterate through each article in object
    cnt = 0
    for document in pubmed_obj:
        print(cnt)
        if cnt % 1000 == 0:
            print(str(cnt) + " documents processed...")
        
        # Separate title, abstact and body into sentences
        titles = tokenizer.tokenize(document['ArticleTitle'])
        abstracts = tokenizer.tokenize(document['Abstract'])
        bodies = tokenizer.tokenize(document['BODY'])

        # Get all patterns for current document
        filtered_patterns = []
        for pattern in pubmed_pattern_obj:
            if int(pattern['doc_id']) == int(document['id']):
                filtered_patterns.append(pattern)

        # Initialize the variable to keep track of the index of each sentence relative to the whole paper
        start_in_paper = 0
        sentId_in_paper = 0

        # First process sentences in title
        title_objs = process_sentences(titles, document, start_in_paper, sentId_in_paper, 1, document['ArticleTitle'], 0, filtered_patterns)
        # Reinitialize start index (+1 to address the offset)
        start_in_paper = len(document['ArticleTitle']) + 1
        # Then process sentences in abstract
        abstract_objs = process_sentences(abstracts, document, start_in_paper, sentId_in_paper, 0, document['Abstract'], len(titles), filtered_patterns)
        # Reinitialize start index (+2 to address the offset)
        start_in_paper = len(document['ArticleTitle']) + len(document['Abstract']) + 2
        # Then process sentences in body
        body_objs = process_sentences(bodies, document, start_in_paper, sentId_in_paper, 2, document['BODY'], len(titles) + len(abstracts), filtered_patterns)
        
        # Combine the tree objs
        combined_obj += (title_objs + abstract_objs + body_objs)
        
        cnt += 1

    return combined_obj

def encode_json_to_file(json_obj, file_name):
    with open(file_name, 'w') as f:
        f.writelines(json_obj)

def main():
    pubmed_pattern_object = decode_file_to_json('pubmed_pattern.json')
    pubmed_object = decode_file_to_json('COVID19.json')
    # pubmed_object = pubmed_object[:1000]
    print("object read...")
    combined_object = combine_objects(pubmed_object, pubmed_pattern_object)
    encode_json_to_file(combined_object, 'pubmed_with_pattern.json')

if __name__ == "__main__":
    main()
