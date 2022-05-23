// (Re)Sets up the database, including a little bit of sample data
const db = require("./db_connection");

/**** Delete existing table, if any ****/

const drop_stuff_table_sql = "DROP TABLE IF EXISTS technique;"

db.execute(drop_stuff_table_sql);

/**** Create "stuff" table (again)  ****/

const create_stuff_table_sql = `
    CREATE TABLE technique (
    technique VARCHAR(50) NOT NULL,
    mastered TINYINT NOT NULL,
    progress_report VARCHAR(1200) NULL,
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id));
`  

db.execute(create_stuff_table_sql);

/**** Create some sample items ****/

const insert_stuff_table_sql = `
    INSERT INTO technique
        (technique, mastered, progress_report) 
    VALUES 
        (?, ?, ?);
`

db.execute(insert_stuff_table_sql, ['buttercream', '1', 'practiced for a week.']);

db.execute(insert_stuff_table_sql, ['tempering chocolate', '1', "chocolate comp a lot of practice."]);

db.execute(insert_stuff_table_sql, ['swiss meringue', '0', null]);

db.execute(insert_stuff_table_sql, ['sponge', '0', 'cool!']);

/**** Read the sample items inserted ****/

const read_stuff_table_sql = "SELECT * FROM technique";

db.execute(read_stuff_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'technique' initialized with:")
        console.log(results);
    }
);

db.end();