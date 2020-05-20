import json;
import math;
import copy;

## run python3 countEntity.py
## required input: covid19_processed.json (output of combine_json.py)
## output: name_count.json (all entity by name) + type_count.json (top 20 of each type)
if __name__ == '__main__':
	prev_title = "";
	count = 0;
	type_dic = dict();
	name_dic = dict();
	with open("covid19_processed.json") as input: 
		document_entity_dic = dict();
		document_title = "";
		while True:
			line = input.readline();
			if not line: 
				break
			sentence_json = json.loads(line);
			count += 1;
			print(count);
			if (sentence_json["title"] != document_title):
				document_title = sentence_json["title"];
				keys = list(document_entity_dic.keys());
				for i in range(len(document_entity_dic)):
					name_dic[keys[i]] = name_dic.get(keys[i],{});
					name_dic[keys[i]]["sentCount"] = name_dic[keys[i]].get("sentCount", 0) + document_entity_dic.get(keys[i])["count"];
					name_dic[keys[i]]["docCount"] = name_dic[keys[i]].get("docCount", 0) + 1;
					name_dic[keys[i]]["type"] = name_dic[keys[i]].get("type", document_entity_dic.get(keys[i])["type"]);
					name_dic[keys[i]]["name"] = keys[i];
					
					type_dic[name_dic[keys[i]]["type"]] = type_dic.get(name_dic[keys[i]]["type"], {});
					type_dic[name_dic[keys[i]]["type"]]["byDocument"] = type_dic[name_dic[keys[i]]["type"]].get("byDocument", []);
					type_dic[name_dic[keys[i]]["type"]]["bySentence"] = type_dic[name_dic[keys[i]]["type"]].get("bySentence", []);
					
					
					curr_type = name_dic[keys[i]]["type"];
					copy_dic = copy.deepcopy(name_dic[keys[i]]);
					
					not_in_byDocument = True;
					not_in_bySentence = True;
					for j in range(len(type_dic[curr_type]["byDocument"])):
						if (type_dic[curr_type]["byDocument"][j]["name"] == keys[i]):
							not_in_byDocument = False;
							type_dic[curr_type]["byDocument"][j] = copy_dic;
					for j in range(len(type_dic[curr_type]["bySentence"])):
						if (type_dic[curr_type]["bySentence"][j]["name"] == keys[i]):
							not_in_bySentence = False;
							type_dic[curr_type]["bySentence"][j] = copy_dic;
					
					if (not_in_byDocument):
						if (len(type_dic[curr_type]["byDocument"]) < 20):
							type_dic[curr_type]["byDocument"].append(copy_dic);
						else:
							minValue = math.inf;
							minIndex = -1;
							for j in range(len(type_dic[curr_type]["byDocument"])):
								if (type_dic[curr_type]["byDocument"][j]["docCount"] < minValue):
									minIndex = j;
									minValue = type_dic[curr_type]["byDocument"][j]["docCount"];
							if (name_dic[keys[i]]["docCount"] > minValue):
								type_dic[curr_type]["byDocument"].pop(minIndex);
								type_dic[curr_type]["byDocument"].append(copy_dic);
					if (not_in_bySentence):
						if (len(type_dic[curr_type]["bySentence"]) < 20):
							type_dic[curr_type]["bySentence"].append(copy_dic);
						else:
							minValue = math.inf;
							minIndex = -1;
							for j in range(len(type_dic[curr_type]["bySentence"])):
								if (type_dic[curr_type]["bySentence"][j]["sentCount"] < minValue):
									minIndex = j;
									minValue = type_dic[curr_type]["bySentence"][j]["sentCount"];
							if (name_dic[keys[i]]["sentCount"] > minValue):
								type_dic[curr_type]["bySentence"].pop(minIndex);
								type_dic[curr_type]["bySentence"].append(copy_dic);	
				document_entity_dic.clear();
			entities = sentence_json["entities"];
			for i in range(len(entities)):
				document_entity_dic[entities[i]["name"]] = document_entity_dic.get(entities[i]["name"], {});
				document_entity_dic[entities[i]["name"]]["type"] = document_entity_dic[entities[i]["name"]].get("type", entities[i]["type"]);
				document_entity_dic[entities[i]["name"]]["count"] = document_entity_dic[entities[i]["name"]].get("count", 0) + 1;
			
			
			
	with open('name_count.json', 'w') as out:
		val_list = list(name_dic.values());
		out.write("[\n");
		for i in range(len(val_list)):
			out.write(json.dumps(val_list[i])+",\n");
		out.write("]");
			
		
	with open('type_count.json', 'w') as out:
		json.dump(type_dic, out, ensure_ascii=False, indent=4)

# name type sentCount docCount