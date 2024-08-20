import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { CreateRoleDTO } from './dto/create-role.dto';

@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post('permission') //rotuer.post('access-control/permission')
  createPermission(@Body() createPermission: CreatePermissionDTO){
      return this.accessControlService.createPermission(createPermission)
  }

  @Get('permission') //rotuer.get('access-control/permission')
  findAllPermission(){
    return this.accessControlService.findAllPermission()
  }


  @Post('role') //rotuer.post('access-control/role')
  createRole(@Body() createRoleDTO: CreateRoleDTO ){
    return this.accessControlService.createRole(createRoleDTO)
  }

  @Get('role')
  findAllRole(){
    return this.accessControlService.findAllRole();
  }
}
