import React, { useState } from 'react';
import JsBarcode from 'jsbarcode';
import Quagga from 'quagga';
import './BarcodeReader.css';
import axios from 'axios'

function BarcodeReader() {
  const [barcodeData, setBarcodeData] = useState(null);
  const [modalView, setModalView] = useState(false);
  const [data, setData] = useState({
    stock_name: '',
    stock_kind: '',
    stock_price: '',
    stock_barcode: '',
    stock_expired: '',
    stock_balance_cnt: '',
  });

  const insertStock = () => {
    console.log(data);

    // api 추가
    axios.post('http://localhost:8000/stock/barcode', data)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    })
    setModalView(false)
  };

  const handleData = (item) => {
    setData((prev) => ({
      ...prev,
      [item.name]: item.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;

        // JsBarcode를 사용하여 바코드 생성
        JsBarcode("#barcodeImage", "YOUR_BARCODE_DATA", {
          format: "CODE128", // 바코드 형식에 맞게 설정
          displayValue: true,
        });

        // Quagga를 사용하여 바코드 읽기
        Quagga.decodeSingle(
          {
            decoder: {
              readers: ["ean_reader"], // 읽고자 하는 바코드 유형 선택
            },
            src: imageDataUrl,
          },
          (result) => {
            if (result && result.codeResult) {
              // 바코드 읽은 결과를 표시
              setBarcodeData(result.codeResult.code);
              setData((prev) => ({
                ...prev,
                stock_barcode: result.codeResult.code,
              }));
              console.log(result.codeResult.code);
            } else {
              alert('바코드를 읽을 수 없습니다.');
            }
          }
        );
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='barcode_top'>
      <button 
        onClick={() => {
          setModalView((prev) => !prev)
          setData({}) 
          setBarcodeData(null)
        }}
        style={{
          background: "transparent",
          border: "none",
          boxShadow: "0 0 0 1px #e3e5e8, 0 1px 2px 0 rgba(0,0,0,.04)",
          borderRadius: 4,
          padding: 8,
        }}
      >사전 바코드 등록</button>
      {modalView ? (
        <div className='modal_background'>
          <div className='modal_top'>
            <span className='modal_header'>재고 입력</span>
            {!barcodeData && (
              <div className='modal_row_center'>
                <span>바코드 등록 : </span>{' '}
                <input
                  type='file'
                  id='barcodeImageInput'
                  accept='image/*'
                  onChange={handleImageUpload}
                />
              </div>
            )}
            <div
              id='barcodeResult'
              style={{ display: barcodeData ? 'flex' : 'none' }}
            >
              <img src='' alt='Barcode' id='barcodeImage' />
            </div>
            {barcodeData && (
              <div className='modal_row'>
                <span>바코드 데이터 </span>
                <input
                  type='text'
                  name=''
                  value={data.stock_barcode}
                  readOnly
                />
              </div>
            )}
            <div className='modal_row'>
              <span>제품명 </span>
              <input
                type='text'
                name='stock_name'
                value={data.stock_name}
                onChange={(e) => handleData(e.target)}
              />
            </div>
            <div className='modal_row'>
              <span>종류 </span>
              <input
                type='text'
                name='stock_kind'
                value={data.stock_kind}
                onChange={(e) => handleData(e.target)}
              />
            </div>
            <div className='modal_row'>
              <span>가격 </span>
              <input
                type='text'
                name='stock_price'
                value={data.stock_price}
                onChange={(e) => handleData(e.target)}
              />
            </div>
            <div className='modal_row'>
              <span>유통기한 </span>
              <input
                type='date'
                name='stock_expired'
                value={data.stock_expired}
                onChange={(e) => handleData(e.target)}
              />
            </div>
            <div className='modal_row'>
              <span>수량 </span>
              <input
                type='text'
                name='stock_balance_cnt'
                value={data.stock_balance_cnt}
                onChange={(e) => handleData(e.target)}
              />
            </div>
            <div className='modal_row'>
              <button  style={{
            color: "black",
            backgroundColor: "white",
            width: 100,
            fontSize: 15,
            height: 32,
            paddingRight: 14,
            paddingLeft: 14,
            borderRadius: 6,
            borderColor: "darkgray",
          }} onClick={()=>setModalView(false)}>입력취소</button>
              <button  style={{
            color: "black",
            backgroundColor: "white",
            width: 100,
            fontSize: 15,
            height: 32,
            paddingRight: 14,
            paddingLeft: 14,
            borderRadius: 6,
            borderColor: "darkgray",
          }} onClick={insertStock}>입력완료</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BarcodeReader;
