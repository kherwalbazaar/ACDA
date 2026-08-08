/**
 * This is a suggested Firebase Cloud Functions implementation.
 * You need to set up Firebase Functions in your project to use this.
 * Run 'firebase init functions' in your terminal.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Triggered when any data is added or deleted in specific paths.
 * Sends a push notification to all users subscribed to the "all" topic.
 */
exports.notifyOnDataChange = functions.database.ref('/{collection}/{id}')
    .onWrite(async (change, context) => {
        const collection = context.params.collection;

        // Ignore chat messages to avoid spamming (optional)
        if (collection === 'chat') return null;

        let title = 'Data Updated';
        let body = `Something was updated in ${collection}`;

        if (!change.before.exists()) {
            title = 'New Item Added';
            body = `A new entry was added to ${collection}`;
        } else if (!change.after.exists()) {
            title = 'Item Deleted';
            body = `An entry was removed from ${collection}`;
        } else {
            // It's an update, maybe don't send notification for every minor update
            return null;
        }

        const message = {
            notification: {
                title: title,
                body: body,
            },
            topic: 'all',
        };

        try {
            const response = await admin.messaging().send(message);
            console.log('Successfully sent message:', response);
            return response;
        } catch (error) {
            console.log('Error sending message:', error);
            return null;
        }
    });
