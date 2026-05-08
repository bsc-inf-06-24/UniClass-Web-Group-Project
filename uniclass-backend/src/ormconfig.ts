import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';


dotenv.config();

export default new DataSource({
    type: 'oracle',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    serviceName: process.env.DB_SERVICE_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
});