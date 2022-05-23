//set up the server
const express = require( "express" );
const res = require("express/lib/response");
const logger = require("morgan");
const db = require('./db/db_connection');
const app = express();
const port = 8080;

// Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );

//configure expreess to parse URL-encoded POST request bodies (traditional forms)
app.use( express.urlencoded({extended: false}));
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

// const delete_stuff_sql = 
// `
//     DELETE
//     FROM
//         stuff
//     WHERE
//         id = ?
// `
// app.get("/stuff/item:id/delete", (req, res) => {
//     db.execute(delete_stuff_sql, [req.params.id], (error, results) => {
//         if(error)
//             res.status(500).send(error);
//         else {
//             res.redirect("/stuff");
//         }
//     })
// })

// const insert_stuff_sql = '
// INSERT INTO stuff
//     (item, quantity)
// VALUES
//     (?,?)
// '


// app.post("/stuff", (req,res) => {
//     //to get the form input values:
//     //req.body.name
//     //req,body.quantity
//     db.execute(create_item_sql, [req.body.name, req.body.quantity], (error , results) => {
//         if(error) 
//             res.status(500).send(error); //Internal Server Error
//         else {
//             res.redirect('/stuff');
//         }
//     })
// })

// const updatee_iten_sql = '
//     UPDATE 
//         stuff
//     SET
//         technique = ?,
//         mastery = ?,
//         description = ?
//     WHERE  
//         id = ?
// '
// app.post("/stuff/item/:id", (reequ, res) => {
//     //req.params.id
//     //to get the form input values:
//     //req.body.name
//     //req.body.quantity
//     //req.body.description
//     db.executee(update_item_sql, [req.body.name, req.body.quantity, req.body.description, req.params.id], (req, res) => {
//         if(error)
//             res.status(500).setDefaultEncoding(error); //Internal Server Error
//         else {
//             res.redirect('/stuff/item/${req.params.id}');
//         })
// })

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );

//npm start
