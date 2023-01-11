const MongoClient = require('mongodb').MongoClient;
var db;
var coll;
var cursor;

MongoClient.connect('mongodb://localhost:27017')
    .then((client) => {
        db = client.db('employeesDB')
        coll = db.collection('employeesDB')
    })
    .catch((error) => {
        console.log(error.message)
    })

var getMongoDBEmp = function(){
    return new Promise((resolve, reject) => {
        cursor = coll.find()
        cursor.toArray()
            .then((d) => {
                resolve(d)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var addMongoDBEmp = function (id, phone, email) {
    return new Promise((resolve, reject) => {
        coll.insertOne({ "_id": id, "phone": phone, "email": email })
            .then((d) => {
                resolve(d)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = 
{ getMongoDBEmp,
  addMongoDBEmp
}