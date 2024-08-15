import { Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Permission, Role])
  ],
  controllers: [AccessControlController],
  providers: [AccessControlService],
})
export class AccessControlModule {}
