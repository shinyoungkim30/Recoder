const Sequelize = require('sequelize')

class Loading extends Sequelize.Model {
    static initiate(sequelize) {
        Loading.init({
            loading_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '적재 식별자'
            },
            loading_type: {
                type: Sequelize.STRING(10),
                allowNull: true,
                comment: '입출고 구분'
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            loading_cnt: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: '처리 수량'
            },
            loading_floor: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: '적재물 층-선반'
            },
            loading_position: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: '적재물 위치'
            },
            stock_shipping_des: {
                type: Sequelize.STRING(500),
                allowNull: true,
                comment: '배송지 정보'
            },
            loading_manager: {
                type: Sequelize.STRING(45),
                allowNull: true,
                comment: '입출고 담당자'
            },
            out_created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment:'출고일'
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Loading',
            tableName: 'loading',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.Loading.belongsTo(db.Rack, { foreignKey: 'rack_seq', targetKey: 'rack_seq' })
        db.Loading.belongsTo(db.Stock, { foreignKey: 'stock_seq', targetKey: 'stock_seq' })
        db.Loading.belongsTo(db.Company, { foreignKey: 'com_seq', targetKey: 'com_seq' })
    }
}

module.exports = Loading