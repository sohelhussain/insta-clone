const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'insta',
  brokers: [process.env.KAFKA_BROKER], // Replace with your Kafka broker addresses
});

const producer = kafka.producer({
  // No explicit partitioner specified, using default
});
const consumer = kafka.consumer({ groupId: 'password-reset-group' });

module.exports = { producer, consumer };