
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';//
import { CoursesModule } from './courses/courses.module'; //josh
import { GroupsModule } from './groups/groups.module';//mirriam
import { SeederModule } from './seeder/seeder.module';//patrick


@Module({
imports: [
ConfigModule.forRoot({ isGlobal: true }),
TypeOrmModule.forRoot({
type: 'oracle',
host: process.env.DB_HOST,
port: Number(process.env.DB_PORT),
username: process.env.DB_USER,
password: process.env.DB_PASS,
serviceName: process.env.DB_SERVICE_NAME,
entities: [__dirname + '/**/*.entity{.ts,.js}'],
synchronize: true,
}),
UsersModule,
GroupsModule,
CoursesModule,
SeederModule,
],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}