import { BooksCategoryModule } from './books category/bookscategory.module';
import { BooksCategoryService } from './books category/bookscategory.service';
import { BookModule } from './book/book.module';
import { BookService } from './book/book.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

import { Module } from '@nestjs/common';





@Module({
  imports: [
    BooksCategoryModule,
    BookModule,
    UserModule,
    AuthModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
