import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 
      'mongodb+srv://yaashjainn:2CfKwxYEOFqjowmn@webverse.5exbv3u.mongodb.net/ablespace?retryWrites=true&w=majority',
      {
        dbName: 'ablespace',
      }
    ),
    AuthModule,
    TasksModule,
    ProjectsModule,
    UsersModule,
    EmailModule,
    SeedModule,
  ],
})
export class AppModule {}
