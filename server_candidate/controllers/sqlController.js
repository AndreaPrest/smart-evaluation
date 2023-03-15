const sqlHandler = require("../functionalities/sqlHandler")
const {query} = require("express");

exports.checkQuery = async (req, res, next) => {
    const {db,query} = req.body
    try{
        let result = await sqlHandler.checkQuery(db,query)
        res.send(result)
    }
    catch (err) {
        next(err);
    }
}
