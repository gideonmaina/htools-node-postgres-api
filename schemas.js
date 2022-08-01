//get all nodes
const nodesQueryAll=()=>{  return `select id, uid from sensors_node ss`}

// use node_id or chip_id
const nodeSensorIdsQuery=(nodeId=27)=>{
    const query=`select 
     ss.node_id,
     ss.id sensor_ids
     from sensors_sensor ss
     where ss.node_id=
     (select sn.id
     from sensors_node sn
     where sn.id=${nodeId}
     )
     `
return query;
}


const sensorValueTypes=(sensorId=49)=>{
     return `select 
     distinct(value_type)
     from sensors_sensordatavalue sdv
     inner join 
     (select 
             sd.id sensordata_id,
             sd.sensor_id
             from sensors_sensordata sd
             inner join sensors_sensor ss 
             on sd.sensor_id =ss.id 
     )snt
     on snt.sensordata_id=sdv.sensordata_id 
     where snt.sensor_id=${sensorId};`
   
}


const sensorDayAvg=(date,sensorId,valueType)=>{
return `select 
    snt.location_id,
    extract(day from '2018-05-14'::timestamp)as day,
    TO_CHAR('2018-05-14'::timestamp,'Mon') as month,
    extract(year from '2018-05-14'::timestamp)as year,
    sdv.value_type measurement,
    AVG(cast(value as float)) as day_avg,
    snt.node_id
    from sensors_sensordatavalue sdv
    inner join 
    (select 
            sd.id sensordata_id,
            sd.sensor_id,
            sd."timestamp"  sensordata_tsp,
            ss.node_id,
            sd.location_id
            from sensors_sensordata sd
            inner join sensors_sensor ss on sd.sensor_id =ss.id 		
    )snt
    on snt.sensordata_id=sdv.sensordata_id 
    where 
        snt.sensor_id=31 
        and value_type='P2'
        and value ~'(^\d+\.?\d+$)|(^\d+$)'
        and snt.sensordata_tsp
    between '2018-05-14' and '2018-05-14'::timestamp + interval '24 hours'
    group by 
    sdv.value_type,
    snt.node_id,
    snt.location_id, day,month,year
    ;`

}


const insertIntoPM_DayAvgTable=(data)=>{
    
    let insertStmt=''
    data.forEach(obj=>{
        let columns=Object.keys(obj)
        let values=Object.values(obj)

        insertStmt=`
        INSERT INTO sensors_pm_day_avg(${columns})
        VALUES(${values[0]},${values[1]},'${values[2]}',${values[3]},'${values[4]}',${values[5]},${values[6]})
        `      
    })
    //console.log(insertStmt)
    return insertStmt
    
}







module.exports={
    nodeSensorIdsQuery,
    sensorValueTypes,
    sensorDayAvg,
    insertIntoPM_DayAvgTable
}


// console.log(sensorDayAvg("2018-05-14",'31','p2'))
