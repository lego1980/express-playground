//#2 https://www.youtube.com/watch?v=blQ60skPzl0
//#3 https://www.youtube.com/watch?v=FV1Ugv1Temg routes
//#4 https://www.youtube.com/watch?v=UVAMha41dwo&index=4&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q error handling and nodemon auto restart
//#5 https://www.youtube.com/watch?v=zoSJ3bNGPp0&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=5 CORS 
//#6 https://www.youtube.com/watch?v=WDrU305J1yw&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=6 MongoDB and Mongoose
//#7 https://www.youtube.com/watch?v=CMDsTMV2AgI&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=7 validation
//#8 https://www.youtube.com/watch?v=VKuY8QscZwY&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=8 relation two collections
//#9 https://www.youtube.com/watch?v=3p0wmR973Fw&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=9 populating queries
//#10 https://www.youtube.com/watch?v=srPXMt1Q0nY&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=10 uploading images
//#11 https://www.youtube.com/watch?v=_EP2qCmLzSE&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=11 auth token and bcrypt hashing
//#12 https://www.youtube.com/watch?v=0D5EEKH97NA&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=12 JWT token - jsonwebtoken
//#13 https://www.youtube.com/watch?v=8Ip0pcwbWYM&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=13 JWT with request
//#14 https://www.youtube.com/watch?v=ucuNgSOFDZ0&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=14 controllers
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);