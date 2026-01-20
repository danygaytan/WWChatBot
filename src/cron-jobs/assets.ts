import { CronJob } from 'cron';
import { getAndUpdateAllAssets } from '../api/asset';

export const createGetAndUpdateAllAssetsCronJob = async () => {
    const job = new CronJob(
        '0 * * * *', // runs at every hour.
        async () => {await getAndUpdateAllAssets()},
        null,
        true,
        'America/Los_Angeles'
    );

    job.start();
}