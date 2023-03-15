const topicModel = require("../models/topicModel");
const ObjectId = require('mongodb').ObjectID;

exports.getTopicTree = async (req, res, next) => {

    try{
        const root = await topicModel.findOne({name: "Root"});
        const tree = []
        tree.push(await fillTree(root))
        console.log("Success: Topic tree sent")
        res.send(tree)
    }
    catch (err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Topic Error: Unable to get topic tree, unknown error")
        next(err);
    }


};

exports.insertTopic = async (req, res, next) => {

    const { parentId, name } = req.body;

    try{
        const topic = await topicModel.findOne({name: name, parent: parentId});
        if (topic) {
            const error = new Error("topic already present");
            error.statusCode = 409;
            console.log("Topic Error: Unable to insert topic, topic already present")
            throw error;
        }
        const newTopic = new topicModel({ parent: parentId, name: name, children: [] });

        // save model to database
        newTopic.save(function (err) {
            if (err){
                const error = new Error("Error during insert");
                error.statusCode = 1064;
                console.log("Topic Error: Unable to insert topic, database error")
                throw error;
            }
            console.log(newTopic.name + " saved to Topics collection.");
        });

        //Add topic as children to parent
        await topicModel.findOneAndUpdate({_id:parentId}, { $push: { children: newTopic._id } });

        res.sendStatus(200)
    }
    catch (err)
    {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Topic Error: Unable to insert topic, unknown error")
        next(err);
    }
};

exports.deleteTopic = async (req, res, next) => {
    const { _id } = req.body;
    try{
        const topic = await topicModel.findById({_id:_id})
        topicModel.findByIdAndRemove({_id:_id}).then(()=>{
            topicModel.deleteMany({_id:topic.children}).then (()=> {
                    topicModel.findByIdAndUpdate(topic.parent, { $pull: { children: new ObjectId(_id) } }).then(() =>{
                            console.log("Success: topic deleted")
                            res.sendStatus(200)
                        }
                    )
                }
            )
        })
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Topic Error: Unable to delete topic, unknown error")
        next(err);
    }

}

exports.editTopic = async (req, res, next) => {
    const { _id,name } = req.body;
    try{
        topicModel.findByIdAndUpdate(_id, { name:name }).then(()=>{
            console.log("Success: topic edited")
            res.sendStatus(200)
        })
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Topic Error: Unable to edit topic, unknown error")
        next(err);
    }

}

exports.getTopicList = async (req, res, next) => {
    try{
        topicModel.find().select(['_id','name',"questionsNumber"]).then((topics)=>{
            const filteredTopics = topics.filter(function (el) {
                return el.name !== "Root"
            });

            console.log("Success: all topics sent")
            res.send(filteredTopics)
        })
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        console.log("Topic Error: Unable to edit topic, unknown error")
        next(err);
    }

}

async function fillTree(topic)
{
    const children = topic.children //qui ho tutti gli id
    const name = topic.name //qui ho il suo nome
    const id = topic._id
    const a = []

    if(children.length === 0)
    {
        return {_id: id, name:name, children:[]}
    }
    else
    {
        for(const i in children)
        {
            const child = await topicModel.findById(children[i])//qui ho un oggetto name,children
            a.push(await fillTree(child))
        }

        return {_id:id, name:name, children:a}


    }
}