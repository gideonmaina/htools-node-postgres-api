require('dotenv').config()
const moment=require('moment')
const schema=require('./schemas');
const {pool}=require('./config')
const year='2019'
const months=12

//Procedural
const NodeData= async(nodeID)=>{
    
    pool.query(schema.nodeSensorIdsQuery(nodeID),(err,results)=>{ //get sensors in id
       if(err) throw err
        let sensors =results.rows.map((key,val)=> key.sensor_ids)
        //get value_types and values for each sensor
        if(sensors.length>0){ 
           
          sensors.forEach(async sensorId=>{
            //get value_types
            let valueTypes =await getValueTypes(sensorId)
                valueTypes.forEach(async measurement=>{
                //console.log(valueType.value_type)
               //get key column names to be inserted in new avg table
               switch(measurement.value_type){
                case 'P0':
                case 'P1':
                case 'P2':
                    //get day avg data
                    for(let month=0;month<months;month++){
                        const monthDate=moment(year).add(month,'M').format('YYYY-MM')
                        const days=moment(monthDate).daysInMonth(monthDate)
                        for(let day=0;day<days;day++){
                            let date=moment(monthDate).add(day,'d').format('YYYY-MM-DD')
                            // console.log(date)
                            try{
                            let day_avg_data=await getDayAvgData(date,sensorId,measurement.value_type) 
                            if(day_avg_data.length>0){
                                 //insert into PM_DAILY_AVG table
                               await updatePM_DayAvgTable(day_avg_data)
                               //  updatePM_DayAvgTable(day_avg_data)
                            }
                           }
                           catch(e){
                           console.log(e.message)
                           day+=1
                           }

                        }
                    }
                    
                     break;



               }

            })

            
          })
          
        }

    })
    
}

const getValueTypes=(sensorId)=>{
    return new Promise((resolve, reject)=>{
        pool.query(schema.sensorValueTypes(sensorId),(err,results)=>{
            if(err){
            reject();
            throw err;
            }
            
            resolve( results.rows)
    
        })
    })

    
   
}

//insert into PM_DAILY_AVG table

const getDayAvgData= (date,sensorId,valueType)=>{
    const stmt=schema.sensorDayAvg(date,sensorId,valueType)
    return new Promise((resolve,reject)=>{
           pool.query(stmt,(err,results)=>{
            if(err){
            reject(err);
            // throw err;
            }

            else{
            console.log(results)
            // resolve(results.rows)
            }
    
        })
    })
   
    
    
};

const getDayData=async(date,sensorId,valueType)=>{
    const stmt=schema.sensorDayAvg(date,sensorId,valueType)
    const client=await pool.connect();
    try{
            const res=await client.query(stmt)
            return res.rows
        }
        
        // console.log(res.rows)
    finally{
        client.release()
    } 
}

const updatePM_DayAvgTable=(data)=>{
    const query=schema.insertIntoPM_DayAvgTable(data);
    return new Promise((resolve, reject)=>{
        pool.query(query,(err,results)=>{
            if(err){
                reject()
                throw err
            }

            // console.log('Update successful')
            resolve()
        })
    })
  
}

// for(let nodeId=1;nodeId<=381;nodeId++){
//     NodeData(nodeId);
// }


(async()=>{
    let data= await getDayData("2018-05-14",'31','p2');
    console.log(data)
})();




