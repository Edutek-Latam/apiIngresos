import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreatePermissionDTO } from './dto/create-permission.dto';

@Injectable()
export class AccessControlService {

    constructor(
        @InjectRepository(Permission)
        private _permissionRepository : Repository<Permission>,
        @InjectRepository(Role)

        private _roleReporsitory : Repository<Role>
    ){}


    async createPermission(createPermission: CreatePermissionDTO){
        const newPermission = this._permissionRepository.create(createPermission);
        try {
            const permission = await this._permissionRepository.save(newPermission)
            return permission
        } catch (error) {
            console.error(error)
        }
    }
}
