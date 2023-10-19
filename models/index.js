const Sequelize = require('sequelize')
const User = require('./user')
const Company = require('./company')
const Client = require('./client')
const Warehouse = require('./warehouse')
const Rack = require('./rack')
const Loading = require('./loading')
const Notice = require('./notice')
const Stock = require('./stock')

const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.js')[env]
const db = {}

const sequelize = new Sequelize(config.database, config.username, config.password, config)

db.sequelize = sequelize

db.User = User
db.Company = Company
db.Client = Client
db.Warehouse = Warehouse
db.Rack = Rack
db.Loading = Loading
db.Notice = Notice
db.Stock = Stock
db.Client = Client

User.initiate(sequelize)
Company.initiate(sequelize)
Client.initiate(sequelize)
Warehouse.initiate(sequelize)
Rack.initiate(sequelize)
Loading.initiate(sequelize)
Notice.initiate(sequelize)
Stock.initiate(sequelize)
Client.initiate(sequelize)

User.associate(db)
Company.associate(db)
Client.associate(db)
Warehouse.associate(db)
Rack.associate(db)
Loading.associate(db)
Notice.associate(db)
Stock.associate(db)
Client.associate(db)

module.exports = db