import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/global/redis/redis.module';
import { EventModule } from './module/events/event.module';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { ChatModule } from './module/chat/chat.module';
import { FriendsModule } from './module/friends/friends.module';
import { SightsModule } from './module/sights/sights.module';

@Module({
  imports: [
    // ConfigModule로 환경 변수 로드
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 환경 변수를 사용할 수 있게 설정
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    EventModule,
    UserModule,
    AuthModule,
    ChatModule,
    FriendsModule,
    RedisModule,
    SightsModule,
  ],
})
export class AppModule {}
