import { Body, Controller, Post } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { CreatePermissionDTO } from './dto/create-permission.dto';

@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post('permission')
  createPermission(@Body() createPermission: CreatePermissionDTO){
      return this.accessControlService.createPermission(createPermission)
  }
}
