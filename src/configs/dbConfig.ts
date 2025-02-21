import dataSource from '../dataSource';
import logger from './loggerConfig';

class DBConnection {
    private isConnected: boolean;
    private static instance: DBConnection | null = null;

    constructor() {
        this.isConnected = false;
    }

    public static getInstance() {
        if(!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
        else {
            logger.error('Only One Connection can exist');
            throw new Error('Only One Connection can exist');
        }

        return DBConnection.instance;
    }

    async connect() {
        if(this.isConnected) {
            logger.error('DB is already connected');
            throw new Error('DB is already connected');
        }
        else {
            await dataSource.initialize();
            logger.info('DB Successfully Connected');
            this.isConnected = true;
        }
    }
}

const db = DBConnection.getInstance();

export default db;