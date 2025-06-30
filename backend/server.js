const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});

// Middleware to verify JWT
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: 'You are not authenticated' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ Error: "Invalid token" });
    }
    req.name = decoded.name;
    req.role = decoded.role;
    next();
  });
};

// Welcome route - checks JWT
app.get('/welcome', verifyUser, (req, res) => {
  return res.json({ Status: 'Success', name: req.name, role: req.role });
});

// Register new user
app.post('/register', (req, res) => {
    const sql = "INSERT INTO sigin (`name`, `username`, `password` , `role`) VALUES (?)";
    const saltRounds = 10;

    const rawPassword = req.body.password?.toString().trim();
    

    bcrypt.hash(rawPassword, saltRounds, (err, hash) => {
        if (err) {
            return res.json({ Error: "Error hashing password" });
        }
        const values = [
            req.body.name,
            req.body.username,
            hash,
            req.body.role
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

// Login route with role check
app.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.json({ Error: "All fields (username, password, role) are required" });
  }

  const sql = 'SELECT * FROM sigin WHERE username = ?';
  db.query(sql, [username], (err, data) => {
    if (err) {
      return res.json({ Error: "Login error in server" });
    }

    if (data.length === 0) {
      return res.json({ Error: "Username does not exist" });
    }

    const user = data[0];

    bcrypt.compare(password.toString(), user.password, (err, result) => {
      if (err) {
        return res.json({ Error: "Error comparing password" });
      }

      if (!result) {
        return res.json({ Error: "Password not matched" });
      }

      if (user.role !== role) {
        return res.json({ Error: "Role does not match for this user" });
      }

      const token = jwt.sign(
        { name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
       
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return res.json({ Status: "Success", role: user.role , name:user.name });
    });
  });
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ Status: "Success" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

