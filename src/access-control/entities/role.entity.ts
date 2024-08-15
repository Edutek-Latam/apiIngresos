import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permission } from "./permission.entity";

@Entity({name:'role'})
export class Role { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true, nullable: false})
    name: string;

    @Column({nullable: false})
    description: string;

    @Column({default: true, name:'is_active'})
    isActive: boolean

    @ManyToMany(()=>Permission,permission => permission.roles)
    @JoinTable({
        name:'role_permissions',
        joinColumn:{name:'role_id',referencedColumnName:'id'},
        inverseJoinColumn:{name:'permission_id', referencedColumnName:'id'}
    })

    permissions: Permission[];

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date

}