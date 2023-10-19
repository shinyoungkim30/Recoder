const Sequelize = require('sequelize')

class Company extends Sequelize.Model {
    static initiate(sequelize) {
        Company.init({
            com_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "기업 식별자"
            },
            com_business_num: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: "사업자등록번호"
            },
            com_name: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "기업명"
            },
            com_address: {
                type: Sequelize.STRING(600),
                allowNull: false,
                comment: "기업 주소"
            },
            com_tel: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: "기업 연락처"
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }            
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Company',
            tableName: 'company',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.Company.hasMany(db.User, { foreignKey: 'com_seq', sourceKey: 'com_seq' })
        db.Company.hasMany(db.Warehouse, { foreignKey: 'com_seq', sourceKey: 'com_seq' })
        db.Company.hasMany(db.Loading, { foreignKey: 'com_seq', sourceKey: 'com_seq' })
    }
}

module.exports = Company