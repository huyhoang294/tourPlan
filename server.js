import express from "express";
import pkg from 'body-parser';
import cors from "cors";
import db from "./app/models/index.js";
import session from "express-session";
import passport from "passport";
import connectEnsureLogin from 'connect-ensure-login';
import * as dotenv from 'dotenv';
import userRoute from "./app/routes/user.js";
import planRoute from "./app/routes/plan.js";

dotenv.config();

const app = express();
const { json, urlencoded } = pkg;

var corsOptions = {
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    optionsSuccessStatus: 200,
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.options('*', cors());
// parse requests of content-type - application/json
app.use(json());

const oneHour = 60 * 60 * 1000;
app.use(session({
    secret:  process.env.SESSION_KEY,
    saveUninitialized:true,
    cookie: { maxAge: oneHour },
    resave: false 
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(db.user.createStrategy());
passport.serializeUser(db.user.serializeUser());
passport.deserializeUser(db.user.deserializeUser());

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tour plan application." });
});

userRoute(app);
planRoute(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
