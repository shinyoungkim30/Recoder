const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const dotenv = require('dotenv')
const passport = require('passport')
const cors = require('cors')

dotenv.config()
//혜주작성
const outRouter = require('./routes/out')
const userRouter = require('./routes/user')
const comRouter = require('./routes/company')
const rackRouter = require('./routes/rack')
const inRouter = require('./routes/in')
const noRouter = require('./routes/notice')
const stockRouter = require('./routes/stock')
const wareRouter = require('./routes/ware')
const warehouseRouter = require('./routes/warehouse')

// sequelize 연결
const { sequelize } = require('./models')
const passportConfig = require('./passport')
const webSocket = require('./socket');

const app = express()
passportConfig()
app.set('port', process.env.PORT || 8000)

// 템플릿 엔진 설정
// app.set('view engine', 'html')
// nunjucks.configure('views', {
//     express: app,
//     watch: true,
// })
sequelize.sync({ force: false })
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch((err) => {
    console.error(err);
})

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
// 요청과 응답에 대한 정보 출력
// 이렇게 생긴 애들이 나옵니다 -> GET / 200 6.044 ms - 644
app.use(morgan('dev'))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/img', express.static(path.join(__dirname, 'uploads')))
// json으로 받기
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// 쿠키 세션 설정
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}))
// 로그인 관련 (passport 모듈)
app.use(passport.initialize())
app.use(passport.session())

app.use('/user', userRouter)

// 혜주 작성
app.use('/out', outRouter)
app.use('/company', comRouter)
app.use('/in', inRouter)
app.use('/notice',noRouter)

// 윤영현 著
app.use('/ware', wareRouter)
app.use('/rack', rackRouter)
app.use('/warehouse', warehouseRouter)

app.use('/stock', stockRouter)

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})

webSocket(server, app);