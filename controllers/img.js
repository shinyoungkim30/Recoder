const { Stock } = require('../models')

exports.updateStockAfterUploadImg = async (req, res) => {

  let stock_seq = req.body.stock_seq

  try {
    const result = await Stock.update({
      stock_img: `${req.file.filename}`
    }, {
      where: { stock_seq: stock_seq }
    })
    if (result[0] > 0) {
      res.send('ok')
    } else {
      res.send('업데이트 실패')
    }
  } catch (error) {
    console.error(error);
  }
}