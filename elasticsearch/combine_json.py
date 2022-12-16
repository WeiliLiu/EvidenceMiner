import json
import nltk.data
import ast

def decode_file_to_json(file_name):
    with open(file_name, 'r') as json_file:
        content = json_file.readlines()

    content = [x.strip() for x in content]

    json_object = []
    for object in content:
        curr_object = json.loads(object)
        json_object.append(curr_object)

    return json_object

def process_sentences(sentences, doc, start, id_start, isTitle, whole_text, prevNumSent, patterns, doc_id, sec_name):
    ret = []
    start_store = start
    for sentence in sentences:
        # Inialize an empty object
        currObj = {}
        # Store the PMID 
        currObj['pmid'] = doc['PMID']

        # Store the doi
        currObj['doi'] = doc.get('doi', '')

        # Store the PMCID
        currObj['pmcid'] = doc.get('pmcid', '')

        # Store the source
        currObj['source'] = doc.get('source', '')

        # Store what portion of the paper this sentence belongs to
        currObj['isTitle'] = isTitle

        # Store the sentence itself for display purposes
        currObj['sentence'] = sentence

        # Store the title even if it is the current sentence
        currObj['title'] = doc['ArticleTitle']

        # Store the section order
        currObj['sec_order'] = doc.get('sec_order', [])

        # Journal may not exist in the provided data, so need to check for existence
        if 'Journal' in doc:
            currObj['journal_name'] = doc['Journal']
        else:
            currObj['journal_name'] = "Unknown"

        # Store the current sentence id
        currObj['sentId'] = sec_name + str(id_start)

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
            if int(id_start + prevNumSent) == int(pattern['sentID']):
                temp_pattern = pattern.copy()
                temp_pattern['sentID'] = sec_name + str(id_start)
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
            elif isinstance(doc["AuthorList"], str):
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
        currObj["documentId"] = doc_id

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
        
        # Get all patterns for current document
        filtered_patterns = []
        for pattern in pubmed_pattern_obj:
            if str(pattern['doc_id']) == str(document['id']):
                filtered_patterns.append(pattern)

        numPrevSent = 0
        start_in_paper = 0
        # iterate through the different sections
        numSec = 0
        if 'sec_order' in document:
            numSec = len(document['sec_order'])
        for i in range(numSec + 2):
            # First get the text of the current section
            if i == 1:
                section_text = document['Abstract']
            elif i == 0:
                section_text = document['ArticleTitle']
            else:
                section_text = document[document['sec_order'][i - 2]]

            if len(section_text) == 0:
                start_in_paper += 1
                continue

            # Separate the current section into sentences
            sentences = tokenizer.tokenize(section_text)

            # Initialize the variable to keep track of the index of each sentence relative to the whole paper
            id_start = 0

            # process the sentences in current section
            if i == 1:
                objs = process_sentences(sentences, document, start_in_paper, id_start, 0, section_text, numPrevSent, filtered_patterns, document['id'], 'abstract')
            elif i == 0:
                objs = process_sentences(sentences, document, 0, id_start, 1, section_text, numPrevSent, filtered_patterns, document['id'], 'title')
            else:
                objs = process_sentences(sentences, document, start_in_paper, id_start, i, section_text, numPrevSent, filtered_patterns, document['id'], document['sec_order'][i - 2])

            numPrevSent += len(sentences)
            
            start_in_paper += len(section_text)
            if i <= 1:
                start_in_paper += 1

            # Combine the tree objs
            combined_obj += objs
        
        cnt += 1

    return combined_obj

def encode_json_to_file(json_obj, file_name):
    with open(file_name, 'w') as f:
        f.writelines(json_obj)

def main():
    pubmed_pattern_object = decode_file_to_json('pubmed_pattern.json')
    pubmed_object = decode_file_to_json('COVID-19-frontend_withsections.json')
    print("object read...")
    combined_object = combine_objects(pubmed_object, pubmed_pattern_object)
    encode_json_to_file(combined_object, 'covid19_processed.json')

if __name__ == "__main__":
    main()
