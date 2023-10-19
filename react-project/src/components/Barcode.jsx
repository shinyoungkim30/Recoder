import React, { useRef, useState } from 'react';
import '../css/barCode.css';
import { useNavigate } from 'react-router';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import Quagga from 'quagga';

function Barcode({ inputItem, setInputItem }) {
  const [barcodeData, setBarcodeData] = useState('');
  const fileInputRef = useRef(null); // 파일 입력 요소의 ref를 생성합니다.

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

  const nav = useNavigate();

  // input 입력값 관리

  // input id 관리할 변수
  const nextID = useRef(0);
  const com_seq = 1;

  // + 버튼 클릭 시 새로운 input 추가
  const addInput = () => {
    const newInputItem = {
      id: nextID.current,
      title: ''
    };

    setInputItem([...inputItem, newInputItem]);
    nextID.current += 1;
  };

  // - 버튼 클릭 시 해당 input 삭제
  const delInput = (id) => {
    setInputItem(inputItem.filter((item) => item.id !== id));
  };

  // input 값 변경 시 해당 input의 title 업데이트
  const handleBarcode = (id, value) => {
    setInputItem(
      inputItem.map((item) =>
        item.id === id ? { ...item, title: value } : item
      )
    );
  };

  // "등록" 버튼 클릭 시 inputItem을 콘솔에 출력
  const sendBarcode = () => {
    console.log('모든 input 값:', inputItem);
    const bData = {
      barcode: barcodeData,
      com_seq: com_seq
    };
    axios.post('http://localhost:8000/in/barcode', bData)
      .then(response => {
        console.log('바코드찍힌 리스트 가져오기 성공', response.data);
        nav('/in/create');
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          console.log(error);
        }
        // 오류 처리
      });
  };

  // h1 태그 클릭 시 파일 입력 요소 클릭
  const handleH1Click = () => {
    fileInputRef.current.click();
  };

  return (
    <div id="bc_container">
      <div id="bc_top">
        <h1 id="bc_header" onClick={handleH1Click}>바코드 등록</h1>
        {/* 파일 입력 요소에 ref를 설정합니다. */}
        <input type="file" id="barcodeImageInput" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} style={{ display: 'none' }} />
        <div id="barcodeResult" style={{ display: barcodeData ? 'flex' : 'none' }}>
          <img src="" alt="Barcode" id="barcodeImage" />
        </div>
      </div>
      <div id="bc_bottom">
        {inputItem.map((item) => (
          <div key={item.id}>
            <input
              type="text"
              value={barcodeData}
              onChange={(e) => handleBarcode(item.id, e.target.value)}
            />
            <button onClick={addInput}>+</button>
            <button onClick={() => delInput(item.id)}>-</button>
          </div>
        ))}

        <button className="custom-btn btn-1" onClick={sendBarcode}>
          등록
        </button>
      </div>
    </div>
  );
}

export default Barcode;
