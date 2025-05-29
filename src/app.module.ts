import { MulterConfigService } from './common/config/multerConfig.service';
import { BooksCategoryModule } from './books category/bookscategory.module';

import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './common/config';

@Module({
  imports: [
    BooksCategoryModule,
    BookModule,
    UserModule,
    AuthModule,
    DatabaseModule,


    MulterModule.registerAsync({
      useClass: MulterConfigService

    }),

    //  MulterModule.registerAsync({
    //   useFactory: () => multerConfig,
    // }),

  ],
  controllers: [],
  providers: [
    // MulterConfigService,
  ],
})
export class AppModule { }
