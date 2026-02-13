import { CronJob } from 'cron';
import { getAndUpdateAllAssets } from '../controllers/asset';

export const createGetAndUpdateAllAssetsCronJob = async () => {
    const job = new CronJob(
        '* * * * *', // runs at every hour.
        async () => {await getAndUpdateAllAssets()},
        null,
        true,
        'America/Los_Angeles'
    );

    job.start();
}