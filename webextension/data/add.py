import json

jsonData = {}
with open('data.json') as json_data:
    d = json.load(json_data)
   # print len(d['search_engines'])
    #print d[2]
    for item in d['search_engines']:
   	#print type(item)
	item.update({'dropdown':'false'})

    jsonData=d

with open('data.json','w') as outfile:
	json.dump(jsonData,outfile)
