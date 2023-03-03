var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var passport = require('passport');
var methodOverride = require('method-override')

// Connect to db
var config = require('./config/db.js');
mongoose.connect(config.database);
var db  = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function() {
    console.log('Connection to MongoDB');
})

// Init app
var app = express();

// View engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

// Set public folder
app.use(express.static(path.join(__dirname,'public')));

// Set fileUpload
app.use(fileUpload());

// Set methodOverride
app.use(methodOverride('_method'));

// Set global errors variable
app.locals.errors = null;

// Set Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Set express session middleware
app.use(session({
    secret: 'keyboard cat',
    // resave: false,
    resave: true,
    saveUninitialized: true,
    // cookie: {secure: true}
    cookie: {},
}));


// Set messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// sử dụng câu lệnh này là vì thằng pages và categorys nằm trên
// header nếu không thì lúc thêm nó sẽ không cập nhập liền
// nếu như không nằm trên header thì không cần


// Get Category Model
var Category = require('./models/category');
// Get all categories to pass to header.ejs
Category.find(function (err, categorys) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categorys = categorys;
    }
});


// Passport Config
require('./config/passport')(passport);
require('./config/passport_google')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next) {
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
});

// Set router
var pages = require('./router/pages.js');
var products = require('./router/products.js');
var cart = require('./router/cart.js');
var search = require('./router/search.js');
var users = require('./router/users.js');
var auth = require('./router/auth.js');
var adminCategorys = require('./router/adminCategorys.js');
var adminProducts = require('./router/adminProducts.js');
var adminAccounts = require('./router/adminAccounts.js');
var adminBills = require('./router/adminBills.js');

app.use('/admin/bills',adminBills);
app.use('/admin/accounts',adminAccounts);
app.use('/admin/products',adminProducts);
app.use('/admin/categorys',adminCategorys);
app.use('/auth',auth);
app.use('/users',users);
app.use('/search',search);
app.use('/cart',cart);
app.use('/products',products);
app.use('/',pages);



// Start the server
var port = 3000;
app.listen(port,function() {
    console.log('Máy chủ hoạt động trên URL:' + port);
})


