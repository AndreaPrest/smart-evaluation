exports.getColumns = function (result)
{
    let columns = []
    for(let i in result)
    {
        let keys = Object.keys(result[i])
        for(let j in keys)
        {
            columns.indexOf(keys[j]) === -1 ? columns.push(keys[j]) : null
        }
    }

    return columns.sort()
}

exports.removeExtraColumns = function (candidateColumns,evaluatorColumns)
{
    return candidateColumns.filter(x => evaluatorColumns.includes(x));
}

exports.getFixedData = function (columns, results)
{
    let arr = []
    for (let i in results)
    {
        let obj = {}
        for(let j in columns)
        {
            obj[columns[j]] = results[i][columns[j]]
        }
        arr.push(obj)
    }

    return arr
}

exports.compare = function ( a, b ) {
    if ( Object.values(a)[0] < Object.values(b)[0] ){
        return -1;
    }
    if ( Object.values(a)[0] > Object.values(b)[0] ){
        return 1;
    }
    return 0;
}

exports.removeDuplicates = function (res)
{
    let jsonObject = res.map(JSON.stringify);
    let uniqueSet = new Set(jsonObject);
    return Array.from(uniqueSet).map(JSON.parse)
}