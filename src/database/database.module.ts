import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Book, User } from './entities';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type : "mysql",
            host: "127.0.0.1",
            port: 3306,
            username: "root",
            database: "libary_db",
            password: "traideas!12",
            entities: [User, Book],
            synchronize: true

        })
    ],
    controllers: [],
    providers: [
        ],
    exports: [TypeOrmModule, ]
})
export class DatabaseModule { }
