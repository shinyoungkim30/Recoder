import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "../css/Mypage.css";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

function GridComplexExample() {
  const [userNick, setUserNick] = useState("");

  const currentPW = useRef();
  const newPW = useRef();
  const nick = useRef();

  const comName = useRef();
  const regNum = useRef();
  const address = useRef();
  const comTel = useRef();

  const [updateUserData, setUpdateUserData] = useState({});
  const [registerComData, setRegisterComData] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8000/user/info")
      .then((res) => {
        setUserNick(res.data.userNick[0].user_nick);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const updateUser = (e) => {
    e.preventDefault();

    setUpdateUserData({
      currentPW: currentPW.current.value,
      newPW: newPW.current.value,
      nick: nick.current.value,
    });
  };

  useEffect(() => {
    axios
      .patch("http://localhost:8000/user", updateUserData)
      .then((res) => {
        if (res.data === "ok") {
          alert('업데이트가 완료되었습니다.');
        } else {
          alert(`${res.data}`);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [updateUserData]);

  const registerCom = (e) => {
    e.preventDefault();

    setRegisterComData({
      com_business_num: regNum.current.value,
      com_name: comName.current.value,
      com_address: address.current.value,
      com_tel: comTel.current.value,
    })
  }

  useEffect(() => {
    axios.post('http://localhost:8000/company', registerComData)
    .then((res) => {
      if (res.data === 'ok') {
        alert('기업 등록이 완료되었습니다.')
        window.location.href = 'http://localhost:3000/main'
      } else {
        alert(`${res.data}`)
      }
    })
    .catch((err) => {
      console.error(err);
    })
  }, [registerComData])

  return (
    <div id="mypage-container">
      <div id="mypage-header">
        <span>마이페이지</span>
      </div>
      <Form style={{ width: 800 }} onSubmit={updateUser}>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>현재 비밀번호</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              ref={currentPW}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>새로운 비밀번호</Form.Label>
            <Form.Control type="password" placeholder="Password" ref={newPW} />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>닉네임</Form.Label>
          <Form.Control placeholder={userNick} ref={nick} />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ marginBottom: 12 }}>
          회원정보 수정
        </Button>
      </Form>

      <div id="mypage-header">
        <span>회사 등록</span>
      </div>
      <Form style={{ width: 800 }} onSubmit={registerCom}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>기업명</Form.Label>
            <Form.Control type="text" placeholder="기업명을 입력하세요" ref={comName} />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>사업자등록번호</Form.Label>
            <Form.Control type="text" placeholder="000-00-00000" ref={regNum} />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>주소</Form.Label>
          <Form.Control placeholder="1234 Main St" ref={address} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress2">
          <Form.Label>전화번호</Form.Label>
          <Form.Control placeholder='000-0000-0000' ref={comTel} />
        </Form.Group>        

        <Button variant="primary" type="submit">
          등록
        </Button>
      </Form>
    </div>
  );
}

export default GridComplexExample;
