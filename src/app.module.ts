import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
