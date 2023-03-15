const codeCompiler = require("./codeCompiler")
const sqlHandler = require("./sqlHandler")
const aux = require("./evaluationAux")
const _ = require('lodash');

exports.evaluateQuestions = async function (test) {

    let questions = test.test
    let finalEvaluation = 0

    for(let q in questions)
    {
        if(questions[q].type === "Quiz")
        {
            if(questions[q].response === null) questions[q].response = []
            let evaluation = evaluateQuiz(questions[q]);
            questions[q].evaluation = evaluation
            finalEvaluation += evaluation

        }
        else if(questions[q].type === "Code")
        {
            if(questions[q].response === null) questions[q].response = ""
            try{
                let evaluation = await evaluateCode(questions[q])
                questions[q].evaluation = evaluation.evaluation
                questions[q].question.content.passedTests = evaluation.passedTests
                finalEvaluation += evaluation.evaluation
            }
            catch (e) {
                throw e;
            }

        }
        else if(questions[q].type === "SQL")
        {
            if(questions[q].response === null) questions[q].response = ""
            let evaluation = await evaluateSQL(questions[q])
            questions[q].evaluation = evaluation.evaluation
            questions[q].question.content.passedTests = evaluation.passedTests
            finalEvaluation += evaluation.evaluation
        }
    }
    test.finalEvaluation = finalEvaluation
    return test;
}

function evaluateQuiz(quiz)
{
    let answerPoint = quiz.value / quiz.question.content.correctAnswers.length
    let evaluation = 0

    for(let i in quiz.response)
    {
        if(quiz.question.content.correctAnswers.includes(quiz.response[i]))
        {
            evaluation += answerPoint
        }
        else
        {
            evaluation -= answerPoint
        }
    }

    return evaluation >= 0 ? evaluation : 0
}

async function evaluateCode(code)
{
    let tests = code.question.content.tests
    let value = code.value/code.question.content.tests.length
    let evaluation = 0
    let passedTests = 0
    let codeToCompile = ""
    let compileResult = {}
    let output = ""

        if(code.response === "")
        {
            return {evaluation:0,passedTests:0}
        }

        for(let i in tests)
        {
            codeToCompile = code.question.content.testLibraries +  code.response  + codeCompiler.getFullTestCodeCpp(tests[i])
            try{
                compileResult = await codeCompiler.compileCode(codeToCompile)
            }
            catch(e)
            {
                throw e;
            }

            output = compileResult.output

            if(output.includes("error"))
            {
                evaluation += 0
            }
            else if(output.includes("Assertion") && output.includes("failed"))
            {
                evaluation += 0
            }
            else
            {
                passedTests += 1
                evaluation += value
            }
        }
        return {evaluation:evaluation,passedTests:passedTests}
}

async function evaluateSQL(sql)
{
    let evaluation = 0
    let value = sql.value/sql.question.content.snapshotTables.length
    let databaseSchema = sql.question.content.databaseSchema
    let snapshotTables = sql.question.content.snapshotTables
    let correctQuery = sql.question.content.query
    let candidateQuery = sql.response
    let passedTests = 0
    let isOrderRelevant = sql.question.content.orderRelevant ? sql.question.content.orderRelevant : false
    let isMultiplicityRelevant = sql.question.content.sameColumnRelevant ? sql.question.content.sameColumnRelevant : false
    let sameColumnRelevant = sql.question.content.multiplicityRelevant ? sql.question.content.multiplicityRelevant : false
    
    if(candidateQuery === "")
    {
        return {evaluation:0,passedTests:0}
    }
    //se non importa molteplicità elimino i doppioni e poi continuo
    for(let i in snapshotTables)
    {
        let evaluatorResult = await sqlHandler.tryQueryOnDB(databaseSchema + snapshotTables[i],correctQuery)
        let candidateResult = await sqlHandler.tryQueryOnDB(databaseSchema + snapshotTables[i],candidateQuery)

        let candidateColumns = aux.getColumns(candidateResult)
        let evaluatorColumns = aux.getColumns(evaluatorResult)

        if(sameColumnRelevant)
        {
            if(JSON.stringify(candidateColumns) !== JSON.stringify(evaluatorColumns))
            {
                evaluation += 0
                continue
            }
        }

        let fixedCandidateColumns = aux.removeExtraColumns(candidateColumns,evaluatorColumns)
        candidateResult = aux.getFixedData(fixedCandidateColumns,candidateResult)

        if(isOrderRelevant)
        {
            candidateResult = candidateResult.sort(aux.compare)
            evaluatorResult = evaluatorResult.sort(aux.compare)
        }

        if(isMultiplicityRelevant)
        {
            candidateResult = aux.removeDuplicates(candidateResult)
        }

        if(candidateResult === null || (!(_.isEqual(evaluatorResult, candidateResult))))
        {
            evaluation += 0
        }
        else
        {
            evaluation += value
            passedTests += 1
        }
    }

    return {evaluation:evaluation,passedTests:passedTests}
}

