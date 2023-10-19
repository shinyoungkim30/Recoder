import React from 'react'

const RegisterCompany = () => {
  return (
    <div>
      회사 등록
      <form>
        <input type='text' placeholder='사업자등록번호'/>
        <input type='text' placeholder='기업명'/>
        <input type='text' placeholder='주소'/>
        <input type='text' placeholder='전화'/>
      </form>
    </div>
  )
}

export default RegisterCompany