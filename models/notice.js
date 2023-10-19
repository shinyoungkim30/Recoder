const Sequelize = require('sequelize')

class Notice extends Sequelize.Model {
    static initiate(sequelize) {
        Notice.init({
            notice_seq: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '알림 식별자'
            },
            notice_content: {
                type: Sequelize.TEXT,
                allowNull: false,
                comment: '알림 내용'
            },
            noticed_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
                comment: '알림 날짜'
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Notice',
            tableName: 'notice',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }

    static associate(db) {
        db.Notice.belongsTo(db.User, { foreignKey: 'user_seq', targetKey: 'user_seq' })
        db.Notice.belongsTo(db.Stock, { foreignKey: 'stock_seq', targetKey: 'stock_seq' })
    }
}

module.exports = Notice