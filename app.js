//set up the server
const express = require( "express" );
const res = require("express/lib/response");
const db = require('./db/db_pool');
const logger = require("morgan");
const app = express();const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

// Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );

// Configure Express to parse URL-encoded POST request bodies (traditional forms)
app.use( express.urlencoded({ extended: false }) );

//defining middleware that logs all incoming requests.
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
} );

// define a route for the stuff inventory page
const read_skillset_sql = `
select technique, mastered, id
from technique
`
app.get( "/skillset", ( req, res ) => {
    db.execute(read_skillset_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.render('skillset', { inventory : results });
    });
});

// define a route for the item detail page
const read_progress_report_sql = `
    SELECT 
        id, technique, mastered, progress_report
    FROM
        technique
    WHERE
        id = ?
`
app.get( "/skillset/report/:id", ( req, res ) => {
    db.execute(read_progress_report_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = results[0]; // results is still an array
            // res.send(data);
            //data looks like {id: ___, technique : ____, mastered: __, progress_report: ____}
            res.render('report', data);
        }
    });
});

// define a route for item DELETE
const delete_technique_sql = `
    DELETE 
    FROM
        technique
    WHERE
        id = ?
`
app.get("/skillset/report/:id/delete", ( req, res ) => {
    db.execute(delete_technique_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/skillset");
        }
    });
})

// define a route for item Create
const create_technique_sql = `
    INSERT INTO technique
        (technique, mastered)
    VALUES
        (?, ?)
`
app.post("/skillset", ( req, res ) => {
    db.execute(create_technique_sql, [req.body.technique, req.body.mastered], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/skillset/report/${results.insertId}`);
        }
    });
})

// define a route for item UPDATE
const update_skillset_sql = `
    UPDATE
        technique
    SET
        technique = ?,
        mastered = ?,
        progress_report = ?
    WHERE
        id = ?
`
app.post("/skillset/report/:id", ( req, res ) => {
    db.execute(update_skillset_sql, [req.body.technique, req.body.mastered, req.body.progress_report, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/skillset/report/${req.params.id}`);
        }
    });
})

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );

//npm start
//npm run devstart