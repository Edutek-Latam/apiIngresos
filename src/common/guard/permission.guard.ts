import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Console } from 'console';
import { Observable } from 'rxjs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
 
  constructor( private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredPermissions = this.reflector.get<string[]>('permissions',context.getHandler());
    console.log(requiredPermissions)
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest()
    const user: User = request.user;

    if(!user || !user.role || !user.role.permissions){
      throw new ForbiddenException()
    }

    const userPermissions = user.role.permissions.map(permission => permission.name);
    const hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission))
    console.log(hasPermission)
    if(!hasPermission){
      throw new ForbiddenException()
    }

    return true;
  }
}
