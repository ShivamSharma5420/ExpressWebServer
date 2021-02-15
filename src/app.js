const path = require('path');
const express = require('express');
const hbs = require('hbs');
const utils = require('./utils/utils');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { send } = require('process');

const createError = require('http-errors');


console.log(__dirname);
console.log(path.join(__dirname, '../public'));


defaultPAth = path.join(__dirname, '../public');

viewsPath = path.join(__dirname, '../templates/views');

partialsPath = path.join(__dirname, '../templates/partials');


//console.log(__filename);

const app = express();

//tell experss which templating engine we are using (here handlebars)
//setup views path (by default it is web-server/views folder )
app.set('view engine', 'hbs');
app.set('views', viewsPath);

hbs.registerPartials(partialsPath);

app.use(cookieParser());

app.use(session({
    secret: 'secret-key',
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 20000 }
}));


//setup static directory to serve
app.use(express.static(defaultPAth));

/*app.get('', (req, res) => {
    res.send("hello express");
});*/

//if we dont define route in use call then that middleware run before every route call
app.use((req, res, next) => {
    console.log("middleware for all")
    next();
})



//specific middleware
app.use('/middle', (req, res, next) => {
    console.log("1st middleware for /middle");
    next();
});

app.use('/middle', (req, res, next) => {
    console.log("2nd middleware for /middle");
    next();
});

app.get('/middle', (req, res, next) => {
    console.log("this is main statement");

    res.send("middleware example look into servers console");
    next();

});

app.use('/middle', (req, res, next) => {
    console.log("last middleware for /middle");
    res.end();
});



app.get('/cookie', (req, res, next) => {
    res.cookie("myCookie", "shivam's cookie");
    console.log("cookie created");
    res.send("cookie is set for local host");

});

app.get('/cookieRemove', (req, res, next) => {
    res.clearCookie('myCookie');
    console.log("Cookie removed");
    res.send("Cookie removed ");

});


app.get('/session', (req, res, next) => {

    if (req.session.views) {
        req.session.views++;
        res.write("views: " + req.session.views);
        res.end();
    }
    else {
        req.session.views = 1;
        res.write("views: " + req.session.views);
        res.write("Refresh page now");
        res.end();
    }

});





app.get('', (req, res) => {
    //loading index.hbs file from views path
    res.render('index', {
        title: 'Dynamic Title1',
        name: 'Dynamic name'
    });
});




app.route('/help').get((req, res) => {

    //loading help.hbs file
    res.render('help', {
        title: 'Dynamic Title2',
        helpMessage: "this is help message"
    });
});

// app.get('/help', (req, res) => {
//     //loading help.hbs file
//     res.render('help', {
//         title: 'Dynamic Title2',
//         helpMessage: "this is help message"
//     });
// });


app.get('/about', (req, res) => {
    res.send("ABOUT PAGE");
});


app.get('/Books', (req, res) => {

    if (!req.query.search) {
        console.log("search query not provided");
        return res.send('Please provide search query');
    }

    console.log(req.query.search);
    res.send({
        books: []
    })


})


//checking the query parameter address if there then sending back the static json
app.get('/weather', (req, res) => {

    if (!req.query.address) {
        console.log("address not provided");
        return res.send({ error: 'please provide address query' })
    }
    // res.send({
    //     forecast: '28',
    //     location: 'Agra',
    //     address: req.query.address

    // })


    utils.geoCode(req.query.address, (error, data) => {
        if (error) {
            res.send({ error });
        }
        else {

            utils.weather(data.latitude, data.longitude, (error, forecastData) => {
                if (error)
                    return console.log(error);


                // res.send({
                //     forecast: forecastData.current.temperature,
                //     location: data.location,
                //     address: req.query.address
                // });

                res.render('weather', {
                    forecast: forecastData.current.temperature,
                    location: data.location,
                    address: req.query.address
                });

            })
        }

    });



});





// app.get('/help', (req, res) => {
//     res.send("<h2>Help Page</h2>");
// });



app.get('/json', (req, res) => {
    res.send([{
        bookTitle: 'Title1',
        bookAuthor: 'Author1'
    },
    {
        bookTitle: 'Title2',
        bookAuthor: 'Author2'
    }]);
});


app.get('/help/*', (req, res) => {
    res.send("<h2>article not found");
});








app.get('*', (req, res, next) => {
    // res.send("<h2>My 404 page</h2>");
    /* res.render('404', {
        errorMessage: 'Page not found'
    })*/

    // const error = new Error('Not found');
    // error.status = 404;
    // next(error);

    next(createError.NotFound("Page not found for this url"));
});

app.use((err, req, res, next) => {
    res.status = err.status || 500;

    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})




app.listen(3000, () => {
    console.log("server on port 3000");
});