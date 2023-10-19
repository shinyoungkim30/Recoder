import React, { useState } from 'react';
import JsBarcode from 'jsbarcode';
import Quagga from 'quagga';

function BarcodeReader() {
  const [barcodeData, setBarcodeData] = useState(null);

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
    <div>
      <input type="file" id="barcodeImageInput" accept="image/*" onChange={handleImageUpload} />
      <div id="barcodeResult">
        <img src="" alt="Barcode" id="barcodeImage" />
      </div>
      {barcodeData && <p>바코드 데이터: {barcodeData}</p>}
    </div>
  );
}

export default BarcodeReader;