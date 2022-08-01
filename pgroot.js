require('dotenv').config()
const {pool}=require('./config')

const createPM_DailyAVG_Table=()=>{
    const query=`
    create table IF NOT EXISTS SENSORS_PM_DAY_AVG(
        id SERIAL PRIMARY KEY,
        location_id int4 NOT NULL,
        day VARCHAR(2) NOT NULL,
        month VARCHAR(8) NOT NULL,
        year VARCHAR(8) NOT NULL,
        measurement varchar(32)  not null,
        day_avg DOUBLE PRECISION,
        node_id int4 NOT NULL,
        CONSTRAINT FK_PMDAYAVG_LOCATION FOREIGN KEY (location_id) 
        REFERENCES sensors_sensorlocation(id),
        CONSTRAINT FK_PMDAYAVG_NODE FOREIGN KEY (node_id) 
        REFERENCES sensors_node(id)
    )
    `

    pool.query(query,(err,results)=>{ //get sensors in id
        if(err) throw err
        console.log(results.rows)
        
    })
}

const deleteTable=(tablename)=>{
    const stmt=`
    DROP TABLE IF EXISTS ${tablename}
    `
    pool.query(stmt,(err,results)=>{ //get sensors in id
        if(err) throw err
        console.log(results.rows)
        
    })
}

// deleteTable("sensors_pm_day_avg")
createPM_DailyAVG_Table();