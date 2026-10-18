import cluster from 'cluster';
import * as os from 'os';
import * as path from 'path';

import 'dotenv/config'

const workerCount = parseInt(process.env.WEB_CONCURRENCY as string) || os.cpus().length;

cluster.setupMaster({ exec: path.join(__dirname, `index${path.extname(__filename)}`) });

for (let i = 0; i < workerCount; i++) {
    cluster.fork();
}
console.log(`Primary ${process.pid} started ${workerCount} workers`);

const RESTART_DELAY_MS = 1000;
cluster.on('exit', (worker, code, signal) => {
    if (worker.exitedAfterDisconnect) {
        return;
    }
    console.log(`Worker ${worker.process.pid} died (${signal || code}), restarting in ${RESTART_DELAY_MS}ms`);
    setTimeout(() => cluster.fork(), RESTART_DELAY_MS);
});
