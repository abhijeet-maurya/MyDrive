const express = require('express');
const userRouter = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const dotenv = require('dotenv');
const connectToDB = require('./config/db.js');
const cookieParser = require('cookie-parser');

dotenv.config();
connectToDB();
const app = express();

app.set('view engine','ejs');
app.use(cookieParser());

app.use('/',indexRouter);
app.use('/user',userRouter);


app.listen(3000,()=>{
    console.log('server is running on port 3000');
});

  // "scripts": {
  //   "test": "echo \"Error: no test specified\" && exit 1",
  //   "start": "npx nodemon app.js"
  // },