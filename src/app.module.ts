import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

import { Module } from '@nestjs/common';





@Module({
  imports: [
    UserModule,
    AuthModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
   
  ],
})
export class AppModule { }
