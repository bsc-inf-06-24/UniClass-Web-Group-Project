import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';


dotenv.config();

export default new DataSource({
    type: 'oracle',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    sid: process.env.DB_SID,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
});