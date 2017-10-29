from bson import json_util
from app import app
from pymongo import MongoClient
from flask import request
import json
from bson.objectid import ObjectId

client = MongoClient('localhost',27017)
db = client.development
rides = db.rides

@app.route('/todo/tasks/<ride_id>',methods=['GET'])
def getone_data(ride_id):
    BSON=rides.find({'_id': ObjectId(ride_id)})
    results = [json.dumps(doc, default=json_util.default) for doc in BSON]
    return json.dumps(results)

@app.route('/todo/tasks',methods=['GET'])
def get_data():
    BSON = rides.find()
    results = [json.dumps(doc, default=json_util.default) for doc in BSON]
    return json.dumps(results)


@app.route('/todo/tasks',methods=['POST'])
def post_data():
    content = request.get_json()
    ride = {
        'name': content['userName'],
        'pickUp': content['pickUp'],
        'dropOff': content['dropOff'],
        'phone': content['phone'],
        'volunteer': content['volunteer'],
        'status': content['status']
    }
    rides = db.rides
    ride_id = rides.insert_one(ride).inserted_id
    print(ride_id)
    return json.dumps({'ride_id':str(ride_id)})

@app.route('/todo/tasks/<ride_id>',methods=['PUT'])
def put_data(ride_id):
    content = request.get_json()
    ride = {
        'status': content['status']
    }
    results = rides.find_one_and_update({'_id': ObjectId(ride_id)}, {"$set": {"status":ride['status']}})
    print(ride['status'])
    return str(results)

@app.route('/todo/tasks/<ride_id>',methods=['DELETE'])
def delete_data(ride_id):
    results = rides.delete_one({'_id':ObjectId(ride_id)})
    deleted=results.deleted_count
    if deleted > 0:
        return str(ride_id)
    else:
        return '0'

if __name__ == '__main__':
    app.run()
