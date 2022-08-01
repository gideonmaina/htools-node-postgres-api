const Pool=require('pg').Pool
//require aws-sdk when connecting to aws instance
const pool=new Pool({
    user:process.env.POSTGRES_DB_USER,
    host:process.env.POSTGRES_DB_HOST,
    password:process.env.POSTGRES_DB_PASSWORD,
    port:process.env.POSTGRES_DB_PORT

    //or connection string
})

module.exports={pool}