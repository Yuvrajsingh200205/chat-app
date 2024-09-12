import express from "express";
import bodyParser from "body-parser";
import pool from "./db/connection.js"; 
import wss from "./server/serverChat.js"; 

const app = express();
const port = 9999;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login", { errorMessage: '' });
});

app.get("/signup", (req, res) => {
    res.render("signup", { errorMessage: '', fullName: '', email: '' });
});

// Signup Post Request
app.post('/signup', (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (password === confirmPassword) {
        const query = 'INSERT INTO user (full_name, email, password) VALUES ($1, $2, $3) RETURNING id';
        pool.query(query, [fullName, email, password], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.render("signup", { 
                    errorMessage: 'Error registering user. Try again later.', 
                    fullName, 
                    email 
                });
            }
            return res.redirect('/login');
        });
    } else {
        res.render("signup", { 
            errorMessage: 'Passwords do not match!', 
            fullName, 
            email 
        });
    }
});

// Login Post Request
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM user WHERE email = $1 AND password = $2';
    pool.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.render('login', { 
                errorMessage: 'Error logging in. Try again later.' 
            });
        }

        if (result.rows.length > 0) {
            return res.redirect('/');
        } else {
            return res.render('login', { 
                errorMessage: 'Invalid email or password.' 
            });
        }
    });
});

// Start Express server and WebSocket server
pool.connect().then(() => {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    // Attach WebSocket server to the same HTTP server
    wss(server);
}).catch(err => {
    console.error('Error connecting to the database', err);
});
