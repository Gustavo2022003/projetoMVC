const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const connection = require('./database/database');
const setUser = require("./middlewares/setUser");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Sessions
app.use(session({
    secret: 'projeto1',
    cookie: {
        maxAge: 1200000,
    },
    resave: false,
    saveUninitialized: false
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(setUser);

// Banco de Dados
connection.authenticate().then(() => {
    console.log('Conexão feita com sucesso!');
}).catch(erro => {
    console.log('Problemas na conexão!');
    console.log(erro);
});

// Rotas
const checkLogin = require("./middlewares/checkLogin");
const userWallet = require("./routes/walletRoutes");
const userRoutes = require("./routes/userRoutes");

app.use('/wallet', userWallet);
app.use('/user', userRoutes);

app.get('/', checkLogin, (req, res, next) => {
    res.render('index');
});

module.exports = app;