const sqlite = require("./asyncSQL")
const _ = require('lodash');

exports.tryQueryOnDB = async function(db,query) {

    // Adds a table
    await sqlite.open(':memory:')

    try{
        const d  = await sqlite.exec(db)
    }
    catch(e)
    {
        console.log(e)
        return null;
    }

    try{
        const q = await sqlite.all(query, [])
        await sqlite.close();
        return q;
    }
    catch(e)
    {
        console.log(e)
        return null;
    }


}

exports.checkQuery = async function(db,query) {

    // Adds a table
    await sqlite.open(':memory:')

    try{
        const d  = await sqlite.exec(db)
    }
    catch(e)
    {
        return e;
    }

    try{
        const q = await sqlite.all(query, [])
        await sqlite.close();
    }
    catch(e)
    {
        return e;
    }


}