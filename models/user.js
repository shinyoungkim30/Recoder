const Sequelize = require('sequelize')

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            user_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "사용자 식별자"
            },
            user_id: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
                comment: "사용자 로그인 아이디"
            },
            user_pw: {
                type: Sequelize.STRING(200),
                allowNull: false,
                comment: "사용자 로그인 패스워드"
            },
            user_nick: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: '사용자 닉네임'
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'user',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.User.belongsTo(db.Company, { foreignKey: 'com_seq', targetKey: 'com_seq' })
        db.User.hasMany(db.Notice, { foreignKey: 'user_seq', sourceKey: 'user_seq' })
    }
}

module.exports = User