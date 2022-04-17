const { Client } = require("pg")

const client = new Client(
    {
        host:"localhost",
        user:"postgres",
        port:5432,
        password:"loki1234",
        database:"reddit"
    }
)

module.exports = client