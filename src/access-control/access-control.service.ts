import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { CreateRoleDTO } from './dto/create-role.dto';

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

    async findAllPermission(){
        return await this._permissionRepository.find() ;
    }

    async createRole(createRoleDTO: CreateRoleDTO){
        const permissions = await this._permissionRepository.findByIds(createRoleDTO.permissionIds)
        const role = await this._roleReporsitory.create({
            ...createRoleDTO,
            permissions
        })

        await this._roleReporsitory.save(role)
        return role;
    }

    async findRole(id: string){
        const role = await this._roleReporsitory.findOneBy( {id} )
        return role
    }
    async findAllRole(){
        return await this._roleReporsitory.createQueryBuilder('role')
        .leftJoinAndSelect('role.permissions','permission')
        .select(['role.id','role.name','role.description','role.isActive','permission.name','permission.description'])
        .getMany()
    }
}
