
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module'; //josh
import { GroupsModule } from './groups/groups.module';//mirriam


@Module({
imports: [
ConfigModule.forRoot({ isGlobal: true }),
TypeOrmModule.forRoot({
type: 'oracle',
host: process.env.DB_HOST,
port: Number(process.env.DB_PORT),
username: process.env.DB_USER,
password: process.env.DB_PASS,
sid: process.env.DB_SID,
entities: [__dirname + '/**/*.entity{.ts,.js}'],
synchronize: true,
}),
UsersModule,
AuthModule,
CoursesModule,
GroupsModule,
],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}