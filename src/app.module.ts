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
import { ReviewModule } from './module/review/review.module';
import { LikeModule } from './module/like/like.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    EventModule,
    ReviewModule,
    LikeModule,
  ],
})
export class AppModule {}
