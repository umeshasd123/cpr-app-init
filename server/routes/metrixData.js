const express = require("express");
const oracledb = require('oracledb');
const router = express.Router();

// Oracle DB config
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString:`${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE_NAME}`,
};

// ✅ Ensure results come as JSON-style objects
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

router.get('', async (req, res) => {
    let {
        page = 1,
        limit = 20,
        search = '',
        status = '',
        fromDate = null,
        toDate = null,
        type = ''
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const conditions = [];
    const binds = {};

    if (search) {
        const columns = [
            'REF_ID', 'DESCRIPTION', 'EVENT_ID', 'UNIQUE_IDENTIFIER', 'CORELATION_ID',
            'ISPAYLOADBASE64ENCRYPTED', 'PAYLOAD', 'PRIMARY_FINDER', 'SECONDARY_FINDER',
            'TERTIORY_FINDER', 'SOURCE_NAME', 'DESTINATION', 'MESSAGE_TYPE', 'CREATIONDATE',
            'HOST_NAME', 'INSTANCE_NAME', 'TOPIC_NAME', 'STATUS'
        ];
        const searchConditions = columns.map(column => `LOWER(${column}) LIKE :search`);
        conditions.push(`(${searchConditions.join(' OR ')})`);
        binds.search = `%${search.toLowerCase()}%`;
    }
    
    if (status) {
        conditions.push(`STATUS = :status`);
        binds.status = `%${status.toLowerCase()}%`;
    }
    if (type) {
        conditions.push(`MESSAGE_TYPE = :type`);
        binds.type = type;
    }
    if (fromDate) {
        conditions.push(`CREATIONDATE >= TO_DATE(:fromDate, 'YYYY-MM-DD')`);
        binds.fromDate = fromDate;
    }
    if (toDate) {
        conditions.push(`CREATIONDATE <= TO_DATE(:toDate, 'YYYY-MM-DD')`);
        binds.toDate = toDate;
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT REF_ID, DESCRIPTION, EVENT_ID, UNIQUE_IDENTIFIER, CORELATION_ID,
             ISPAYLOADBASE64ENCRYPTED, PAYLOAD, PRIMARY_FINDER, SECONDARY_FINDER,
             TERTIORY_FINDER, SOURCE_NAME, DESTINATION, MESSAGE_TYPE, CREATIONDATE,
             HOST_NAME, INSTANCE_NAME, TOPIC_NAME, STATUS
      FROM EVENTHUB_GENERIC_EVENT_AUDIT
      ${whereClause}
      ORDER BY CREATIONDATE DESC
      OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
    `;
    const countBinds = { ...binds };
    binds.offset = offset;
    binds.limit = limit;

    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Connected to Oracle DB!");
        // Count total rows matching filters (without pagination)
        const countResult = await connection.execute(
            `SELECT COUNT(*) AS TOTAL FROM EVENTHUB_GENERIC_EVENT_AUDIT ${whereClause}`, countBinds
        );
        const total = countResult.rows[0].TOTAL;

        const result = await connection.execute(query, binds,
            {
                fetchInfo: { "PAYLOAD": { type: oracledb.STRING } }
            }
        );

        res.status(200);
        res.json({ total, data: result.rows });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Connection close error:', err);
            }
        }
    }
})

module.exports = router;