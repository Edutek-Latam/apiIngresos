import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth-guard/auth-guard.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guard/role.guard';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import { Permissions } from 'src/common/decorators/permision.decorator';


@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('2FA/:id')
  enable2FA(@Param('id',ParseUUIDPipe ) id: string){
    return this.userService.enable2FA(id);
  }

 /*  @UseGuards(AuthGuard, PermissionGuard)
 // @Roles('SUPER_ADMIN')
  @Permissions('READ_USER')
  */
  @Get() 
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard, PermissionGuard)
 // @Roles('SUPER_ADMIN')
  @Permissions('VIEW_USER')
  @Get(':id')
  findOne(@Param('id',ParseUUIDPipe ) id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard, PermissionGuard)
  // @Roles('SUPER_ADMIN')
   @Permissions('UPDATE_USER')
  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }


  @UseGuards(AuthGuard, RoleGuard,  PermissionGuard)
   @Roles('SUPER_ADMIN')
   @Permissions('UPDATE_USER')
  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
