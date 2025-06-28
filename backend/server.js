const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const app = express()
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173"],
    methods:["POST","GET"],
    credentials:true
}))
app.use(cookieParser())

const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});


const verifyUser =(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.json({Error:'You are not aunthenticated'})
    }
    else{
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                return res.json({Error:"Token is not okey"})
            }
            else{
                req.name=decoded.name
                next()
            }
        })
    }
}

app.get('/welcome',verifyUser,(req,res)=>{
    return res.json({Status:'Success',name:req.name})
})

app.post('/register', (req, res) => {
    const sql = "INSERT INTO sigin (`name`, `username`, `password`) VALUES (?)";
    const saltRounds = 10;

    const rawPassword = req.body.password?.toString().trim();
    

    bcrypt.hash(rawPassword, saltRounds, (err, hash) => {
        if (err) {
            return res.json({ Error: "Error hashing password" });
        }
        const values = [
            req.body.name,
            req.body.username,
            hash
        ];

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("DB INSERT ERROR:", err);
                return res.json({ Error: "Error inserting data into server" });
            }
            return res.json({ status: "Success" });
        });
    });
});


app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM sigin WHERE username = ?';
    db.query(sql, [req.body.username], (err, data) => {
        if (err) {
            return res.json({ Error: "Login error in server" });
        }

        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) {
                    return res.json({ Error: "Password compare error" });
                }

                if (response) {
                    const name = data[0].name;
                    const token = jwt.sign({name},process.env.JWT_SECRET,{expiresIn:'1d'});
                    res.cookie('token',token)
                    return res.json({ Status: "Success"});
                } else {
                    return res.json({ Error: "Password not matched",password:data[0].password });
                }
            });
        } else {
            return res.json({ Error: "Username does not exist" });
        }
    });
});

app.get('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ Status: "Success" });
});

const PORT=process.env.PORT || 3000
app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${PORT}`);
    
})

