const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
    secret:"mysupersecretcode",
    resave: false,
    saveUnintialized: true,
     cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60* 1000,
        maxAge:  7 * 24 * 60 * 60* 1000,
        httpOnly: true,
    },    
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    // console.log(res.locals.success);
    next();
});

const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("./listings/error.ejs", {err});
    // res.status(statusCode).send(message);
});

app.listen(8080,() => {
    console.log("Server is listening to port 8080");
});