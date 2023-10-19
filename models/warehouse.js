const Sequelize = require('sequelize')

class Warehouse extends Sequelize.Model {
    static initiate(sequelize) {
        Warehouse.init({
            wh_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "창고 식별자"
            },
            wh_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: "창고 이름"
            },
            wh_width: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: "창고 가로 면적"
            },
            wh_length: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: "창고 세로 면적"
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Warehouse',
            tableName: 'warehouse',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.Warehouse.belongsTo(db.Company, { foreignKey: 'com_seq', targetKey: 'com_seq' })
        db.Warehouse.hasMany(db.Rack, { foreignKey: 'wh_seq', sourceKey: 'wh_seq' })
    }
}

module.exports = Warehouse