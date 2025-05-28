import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Book, BorrowRecord, Category, User } from './entities';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type : "mysql",
            host: "127.0.0.1",
            port: 3306,
            username: "root",
            database: "libary_db",
            password: "traideas!12",
            entities: [User, Book, Category, BorrowRecord],
            synchronize: true

        })
    ],
    controllers: [],
    providers: [
        ],
    exports: [TypeOrmModule, ]
})
export class DatabaseModule { }
