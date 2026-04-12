import sql from "mssql/msnodesqlv8.js";

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    driver: "ODBC Driver 17 for SQL Server",
    options: {
        instanceName: process.env.DB_INSTANCE,
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log("Connected to SQL Server");
        return pool;
    })
    .catch((err) => {
        console.error("Database Connection Failed! Bad Config: ", err);
        process.exit(1);
    });

export { sql, poolPromise };
