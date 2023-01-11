const express = require('express')
const app = express()
const port = 3000
const mongoose = require("mongoose");

var ejs = require('ejs');
var bodyParser = require('body-parser')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))

var mySqlDAO = require(__dirname + '/mySql_DAO');
var mongoDBDAO = require(__dirname + '/mongoDB_DAO');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html')
})

app.get('/employees', (req, res) => {
    mySqlDAO.getEmployees()
        .then((list) => {
            res.render('employees', { employeeData: list })
        })
        .catch((error) => {
            if (error.errorno == 1146) {
                res.send("Table Error!!: " + error.sqlMessage)
            }
            else (
                res.send("Error!!: " + error)
            )
        })
})

app.get('/employees/edit/:eid', (req, res) => {
    mySqlDAO.updateEmp(req.params.eid)
        .then((listNew) => {
            res.render('editEmpMySQL', { updateEmp: listNew, errors: undefined })
        })
        .catch((error) => {
            if (error.errorno == 1146) {
                res.send("Table Error!!: " + error.sqlMessage)
            }
            else (
                res.send("Error!!: " + error)
            )
        })
})

app.post('/employees/edit/:eid', (req, res) => {
    mySqlDAO.updateEmpData(req.body.eid, req.body.ename, req.body.role, req.body.salary)
        .then((list) => {
            res.redirect("/employees")
        })
        .catch((error) => {
            console.log(error)
        })
})

app.get('/departments', (req, res) => {
    mySqlDAO.getEmpDept()
        .then((list) => {
            res.render('departments', { depList: list })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/department/delete/:did', (req, res) => {
    mySqlDAO.deleteDept(req.params.did)
        .then((list) => {
            if (list.affectedRows == 0) {
                res.send("<h1> Department: " + req.params.did + " Can not be Deleted!, for an unknown reason</h1>" + "<a href='/'>Home</a>")
            } else {
                res.send("<h1> Department: " + req.params.did + " Deleted.</h1>" + "<a href='/'>Home</a>")
            }
        })
        .catch((error) => {
            if (error.code == "ER_ROW_IS_REFERENCED_2") {
                res.send("<h2>Department: " + req.params.did + " Can not be Deleted!, as it has an employee.</h2>" + "<a href='/'>Home</a>")
            }
        })
})

app.get('/employeesMongoDB', (req, res) => {
    mongoDBDAO.getMongoDBEmp()
    .then((list) => {
        res.render('empMongoDB', { mongoDBList: list })
    })
    .catch(() => {
        res.send('error')
    })
})

app.get('/employeesMongoDB/add', (req, res) => {
    res.render("addEmpMongoDB")
})

app.post('/employeesMongoDB/add', (req, res) => {
    mySqlDAO.checkEmployeeID(req.body._id).then((result) => {
        if (result[0] != null) {
            mongoDBDAO.addEmployees(req.body._id, req.body.phone, req.body.email)
            .then((d) => {
                res.redirect("/employeesMongoDB")
            })
            .catch((error) => {
                if (error.message.includes("11000")) {
                    res.send("<h1>_ID: " + req.body._id + " already exists</h1>" + "<a href='/'>Home</a>")
                } else {
                    res.send(error.message)
                }
            })
        }else{
            res.send("<h1>Employee: " + req.body._id + " isn't in mySQL Database</h1>" + "<a href='/'>Home</a>")
        }
    })
    .catch((error) => {
        console.log(error)
    })
})

app.listen(port, () => {
    console.log("Listening on port: " + port)
})