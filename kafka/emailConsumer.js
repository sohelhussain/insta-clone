const { consumer } = require('../kafka/kafkaConfig');
const sendEmail = require('../utils/sendEmail');

const run = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'password-reset-requests' });

        await consumer.run({
            eachMessage: async ({ message }) => {
                try {
                    const { email, subject, message: emailMessage } = JSON.parse(message.value.toString());

                    await sendEmail(email, subject, emailMessage);
                } catch (err) {
                    console.error('Error processing message or sending email:', err);
                }
            },
        });
    } catch (err) {
        console.error('Error running Kafka consumer:', err);
    }
};

module.exports = { run };