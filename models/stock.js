const Sequelize = require('sequelize')

class Stock extends Sequelize.Model {
    static initiate(sequelize) {
        Stock.init({
            stock_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '적재물 식별자'
            },
            stock_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: '적재물 이름'
            },
            stock_kind: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: '적재물 종류'
            },
            stock_price: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '적재물 가격'
            },
            stock_barcode: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: '적재물 바코드'
            },
            stock_img: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment: '적재물 이미지'
            },
            stock_expired: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: '적재물 유통기한'
            },
            stock_balance_cnt: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '적정 재고량'
            }, update_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Stock',
            tableName: 'stock',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.Stock.hasOne(db.Loading, { foreignKey: 'stock_seq', sourceKey: 'stock_seq' })
        db.Stock.hasMany(db.Notice, { foreignKey: 'stock_seq', sourceKey: 'stock_seq' })
        db.Stock.belongsTo(db.Client, { foreignKey: 'cl_seq', targetKey: 'cl_seq' })
    }
}

module.exports = Stock