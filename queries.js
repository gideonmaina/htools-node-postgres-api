

/****Unit Testing
 * 
 Refactor to pass reusable query function 
 */
//get sensors in node
const getNodeSensorIds=(req,res)=>{
    pool.query(nodeSensorIdsQuery(27),(err,results)=>{
        if(err) throw err
        res.status(200).json(results.rows)
    })
}














// const getSensorData=(req,res)=>{
//     pool.query(getSensorData(),(err,results)=>{
//         if(err) throw err
//         res.status(200).json(results.rows)
//     })
// }


module.exports=
{
    getNodeSensorIds
}