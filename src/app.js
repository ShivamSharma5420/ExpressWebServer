const path = require('path');
const express = require('express');

const hbs = require('hbs');


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


//setup static directory to serve
app.use(express.static(defaultPAth));

/*app.get('', (req, res) => {
    res.send("hello express");
});*/


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


app.get('*', (req, res) => {
    res.send("<h2>My 404 page</h2>");
});





app.listen(3000, () => {
    console.log("server on port 3000");
});