const Sequelize = require('sequelize')

class Rack extends Sequelize.Model {
    static initiate(sequelize) {
        Rack.init({
            rack_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '랙 식별자'
            },
            rack_id: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: '랙 아이디'
            },
            rack_position: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: '랙 구역'
            },
            rack_x: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 X 좌표'
            },
            rack_z: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 Z 좌표' 
            },
            rack_width: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 가로 면적'
            },
            rack_length: {
                type: Sequelize.DECIMAL(18, 4),
                allowNull: false,
                comment: '랙 세로 면적'
            },
            rack_floor: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '랙 층수'
            },
            rack_rotate_yn: {
                type: Sequelize.CHAR(1),
                allowNull: true,
                comment: '랙 회전 여부'
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Rack',
            tableName: 'rack',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.Rack.belongsTo(db.Warehouse, { foreignKey: 'wh_seq', targetKey: 'wh_seq' })
        db.Rack.hasMany(db.Loading, { foreignKey: 'rack_seq', sourceKey: 'rack_seq' })
    }
}

module.exports = Rack