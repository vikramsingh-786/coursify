const cron = require('node-cron');
const userModel = require('../models/User');

cron.schedule('0 0 * * *', async () => { 
    try {
        const users = await userModel.find({
            'subscription.expiryDate': { $lt: new Date() },
            'subscription.status': 'active'
        });

        for (const user of users) {
            user.subscription.status = 'inactive'; 
            await user.save();  
            console.log(`Subscription expired for user: ${user.email}`);
        }
    } catch (error) {
        console.error('Error during subscription expiry check:', error);
    }
});
