import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Join.css';

const Join = () => {
    const navigate = useNavigate();
    const [duplicateMessage, setDuplicateMessage] = useState('');
    const [checkMbId, setCheckMbId] = useState(false);

    const [formData, setFormData] = useState({
        user_id: '',
        user_pw: '',
        user_pw_confirm: '',
        user_nick: '',
        user_cname: '',
    });

    const [comNum, setComNum] = useState('')
    const comNumRef = useRef()
    const [comName, setComName] = useState('')

    // 이메일 중복확인
    const checkDuplicate = async () => {
        try {
            const response = await axios.post('http://localhost:8000/user/checkid', {
                id: formData.user_id,
            });
            if (response.data === '회원가입 가능') {
                setDuplicateMessage('사용 가능한 아이디입니다.');
                setCheckMbId(true);
            } else {
                setDuplicateMessage('중복된 아이디입니다.');
                setCheckMbId(false);
            }
        } catch (error) {
            setDuplicateMessage('중복된 아이디입니다.');
            setCheckMbId(false);
        }
    };


    // 가입
    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = async (e) => {

        e.preventDefault();
        if (formData.user_pw !== formData.user_pw_confirm) {
            alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
            return;
        }

        try {

            axios.get('http://localhost:8000/user/test')
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.error(err);
                })
            const response = await axios.post('http://localhost:8000/user', {
                user_id: formData.user_id,
                user_pw: formData.user_pw,
                user_nick: formData.user_nick,
                user_cname: formData.user_cname,

            });
            if (response.data === 'ok') {
                alert(response.data.message || "회원가입되었습니다!");
                navigate("/");
            } else {
                alert(response.data.message || "회원가입에 실패하였습니다.");
            }
        } catch (error) {
            console.error(error);
            alert('회원가입 도중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const searchCompany = () => {
        console.log('검색버튼');
        setComNum(comNumRef.current.value)
        console.log(comNum);
    }

    useEffect(() => {
        console.log('회사정보 요청');
        axios.get(`http://localhost:8000/company/${comNum}`)
            .then((res) => {
                console.log(res);
                if (res.data[0]) {
                    setComName(res.data[0].com_name)
                    alert('완료')
                } else {
                    alert('등록된 회사가 없습니다. 회사 등록으로 이동합니다')
                    navigate('/register/company')
                }
            })
            .catch((err) => {
                console.error(err);
            })
    }, [comNum])

    return (
        <div className='join_main'>
            <body>
                <div className="join_container">
                    <div className="join_form_box">

                        <form onSubmit={onSubmit} className="Join_content1">
                            <h2>
                                회원가입
                            </h2>

                            <div className='input_box'>
                                <input type='text' name='user_id' value={formData.user_id} onChange={onChange} required />
                                <label htmlFor=''>ID</label>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={checkDuplicate}
                                    className="id-check"
                                >
                                    중복 확인
                                </button>
                            </div>
                            <span className="duplicate-message">{duplicateMessage}</span>

                            <div className='input_box'>
                                <input type='text' name='user_nick' value={formData.user_nick} onChange={onChange} className='nick' required />
                                <label htmlFor=''>Nick Name</label>
                            </div>

                            <div className='input_box'>
                                <input type='password' name='user_pw' value={formData.user_pw} onChange={onChange} required />
                                <label htmlFor=''>Password</label>
                            </div>

                            <div className='input_box'>
                                <input type='password' name='user_pw_confirm' value={formData.user_pw_confirm} onChange={onChange} required />
                                <label htmlFor=''>Confirm Password</label>
                            </div>

                            <div className='input_box'>
                                <input type='text' name='user_cname' value={formData.user_cname} onChange={onChange} required />
                                <label htmlFor=''>Company Num</label>
                            </div>

                            {/* <div>
                                <button
                                    className="join-button"
                                    type='button'
                                    style={{ backgroundColor: 'lightgray' }}
                                    onClick={searchCompany}
                                >
                                    검색
                                </button>
                            </div> */}

                            <div className='submit_button'>
                                <button type='submit' className='join_button'>가입하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            </body>
        </div>
    );
}

export default Join;