import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AccessControlModule } from './access-control/access-control.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type:'postgres',
      host:process.env.DB_HOST,
      username:process.env.DB_USER,
      password: process.env.DB_PWD,
      database:process.env.DB_DBNAME,
      ssl: true,
      synchronize: true,
      autoLoadEntities: true
    }),
    ThrottlerModule.forRoot(
      [
        {
          ttl:600,
          limit:10
        }
      ]
    ),
    UserModule,
    AuthModule,
    AccessControlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
