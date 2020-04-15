import requests
import json
def updateCases():
	url ='https://api.rootnet.in/covid19-in/stats/latest'
	r = requests.get(url)
	cdata = r.json()
	stateWiseData = []
	for i in range(len(cdata['data']['regional'])):
		stateData = {}
		stateData['state'] = cdata['data']['regional'][i]['loc']
		stateData['conf'] = cdata['data']['regional'][i]['confirmedCasesIndian']  + cdata['data']['regional'][i]['confirmedCasesForeign']
		stateData['cured'] = cdata['data']['regional'][i]['discharged']
		stateData['deaths'] = cdata['data']['regional'][i]['deaths']
		
		if stateData['conf'] < 100:
			stateData['color'] = '#fef0d9'
		elif stateData['conf'] >= 100 and stateData['conf'] < 500:
			stateData['color'] = '#fdcc8a'
		elif stateData['conf'] >= 500 and stateData['conf'] < 1000:
			stateData['color'] = '#fc8d59'
		elif stateData['conf'] >= 1000 and stateData['conf'] < 2000:
			stateData['color'] = '#e34a33'
		else:
			stateData['color'] = '#b30000'
		# latlong = getLatLong(stateData['state'])
		# stateData['lat'] = latlong[0]
		# stateData['lng'] = latlong[1]
		stateWiseData.append(stateData)
	with open('data.json', 'w') as fp:
		json.dump(stateWiseData, fp,  indent=4)

# def getLatLong(givenState):
# 	with open('./stateCoordinates.json') as f:
#   		data = json.load(f)

# 	for stateDet in data:
# 		if stateDet['state'] == givenState:
# 			return [stateDet['lat'], stateDet['lng']]


updateCases()
