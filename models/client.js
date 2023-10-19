const Sequelize = require('sequelize')

class Client extends Sequelize.Model {
    static initiate(sequelize) {
        Client.init({
            cl_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "거래처 식별자"
            },
            cl_business_num: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: "거래처 사업자등록번호"
            },
            cl_name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "거래처명"
            },
            cl_address: {
                type: Sequelize.STRING(600),
                allowNull: false,
                comment: "거래처 주소"
            },
            cl_tel: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "거래처 연락처"
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Client',
            tableName: 'client',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.Client.hasMany(db.Stock, { foreignKey: 'cl_seq', sourceKey: 'cl_seq' })
    }
}

module.exports = Client