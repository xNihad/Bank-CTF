const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const indexRoutes = require('./routes/index');
const loginRoutes = require('./routes/login');
const dashboardRoutes = require('./routes/dashboard');
const logoutRoutes = require('./routes/logout');
const registerRoutes = require('./routes/register');
const supportRoutes = require('./routes/support');
const balanceTransferRoutes = require('./routes/balanceTransfer');

app.get('/uploads', (req,res)=>{
    res.send("FORBIDDEN 403")
})

app.use(express.static(path.join(__dirname, "balance-transfer")));

app.use('/', indexRoutes);
app.use('/login', loginRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/logout', logoutRoutes);
app.use('/register', registerRoutes);
app.use('/support', supportRoutes);
app.use('/balance-transfer', balanceTransferRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
