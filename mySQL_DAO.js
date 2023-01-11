
var mysql = require('promise-mysql');
var pool;

mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'proj2022'
}).then((d) => {
        pool = d
    }).catch((err) => {
        console.log("pool error:" + err)
    })

var getEmployees = function() {
    return new Promise((resolve, reject) => {
        pool.query("Select * from employee")
            .then((d) => {
                resolve(d)
            })
            .catch(e => {
                reject(e)
            })
    })
}

var updateEmp = function (employID) {
    return new Promise((resolve, reject) => {
        var querySQL = {
            sql: 'select * from employee where eid=?',
            values: [employID]
        }

        pool.query(querySQL)
            .then((d) => {
                resolve(d)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var updateEmpData = function(eid, ename, role, salary) {
    return new Promise((resolve, reject) => {
        var updateQuerySQL = {
            sql: 'update employee set ename = ?, role = ?, salary = ? where eid = ?',
            values: [ename, role, salary, eid]
        }

        pool.query(updateQuerySQL)
            .then((d) => {
                resolve(d)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var getEmpDept = function(){
    return new Promise((resolve, reject) => {
        pool.query('select * from dept')
            .then((d) => {
                resolve(d)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

var deleteDept = function (id) {
    return new Promise((resolve, reject) => {
        var queryDeleteDept = {
            sql: 'delete from dept where did = ?',
            values: [id]
        }
        pool.query(queryDeleteDept)
            .then((d) => {
                resolve(d)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = {
    getEmployees, 
    updateEmp,
    updateEmpData,
    getEmpDept,
    deleteDept
}