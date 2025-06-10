const express = require('express');
const { Kafka } = require('kafkajs');
const { SchemaRegistry, SchemaType } = require('@kafkajs/confluent-schema-registry');
const router = express.Router();

// Endpoint to process Ref.Ids
router.post("", (req, res) => {
    const refIds = req.body;

    // Validate input
    if (!Array.isArray(refIds) || refIds.length === 0) {
        return res.status(500).json({ error: "Invalid request: refIds must be a non-empty array" });
    }

    // Send response
    res.json({ message: `Ref ids [${refIds.join(', ')}] processed successfully` });
    

    // Kafka and Schema Registry config
    // const kafka = new Kafka({
    //     clientId: 'npss-kony-connector',
    //     brokers: ['dcl04-rlu-kbvm1.dibuat.ae:9091'],
    //     ssl: true,
    //     sasl: undefined // Add SASL config if needed
    // });

    // const registry = new SchemaRegistry({
    //     host: 'https://dcl04-rlu-crvm1.dibuat.ae:8081',
    //     auth: {
    //         username: 'ck_schema',
    //         password: 'Dib@10801080'
    //     }
    // });

    // // Example: decide message type based on a field in body or query param
    // const messageType = req.query.type === 'avro' ? 'AVRO' : 'JSON';
    // const topic = 'dib-eeh-npss-pushnotification-kony';

    // const producer = kafka.producer();

    // (async () => {
    //     await producer.connect();

    //     for (const refId of refIds) {
    //         let payload;
    //         let headers = {};

    //         if (messageType === 'AVRO') {
    //             // Example AVRO schema id (replace with actual schema id)
    //             const schemaId = 1;
    //             payload = await registry.encode(schemaId, { refId });
    //             headers['content-type'] = 'avro/binary';
    //         } else {
    //             payload = JSON.stringify({ refId });
    //             headers['content-type'] = 'application/json';
    //         }

    //         await producer.send({
    //             topic,
    //             messages: [
    //                 {
    //                     value: payload,
    //                     headers
    //                 }
    //             ]
    //         });
    //     }

    //     await producer.disconnect();
    // })().catch(err => {
    //     console.error('Kafka error:', err);
    //     res.status(500).json({ error: 'Kafka error', details: err.message });
    // });
});

module.exports = router;