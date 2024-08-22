import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { resourceUsage } from 'process';
import { encript } from 'src/common/utils/bcrypt';
import { AccessControlService } from 'src/access-control/access-control.service';
import { secondFA } from 'src/common/utils/totp';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) 
    private _userRepository: Repository<User>,
    private _accessControlService: AccessControlService
  ){}

  async create(createUserDto: CreateUserDto) {
    const password = encript(createUserDto.password);
    //console.log(password)
    try {
      let role;
    if(createUserDto.role){
        role = await this.findRole(createUserDto.role)
    }
      const newUser =  this._userRepository.create({
        ...createUserDto,
        password, 
        role
      });
      const user = await  this._userRepository.insert(newUser)
      return newUser
    } catch (error) {
      console.error(JSON.stringify({date:new Date().toDateString()  ,   code: error.code, detail: error.detail}))
      if(error.code === '23505'){
        throw new BadRequestException(error.detail)
      }

      throw new InternalServerErrorException(error.detail)

    } 
    //return createUserDto;
  }

  async findAll() {
    return await this._userRepository.find();
  }

  /**
   * 
   * @param id - ID del usuario
   * @returns 
   */
  async findOne(id: string) {
    const user = await this._userRepository.findOne( { 
      where: {id} 
    } );

    if(!user) throw new NotFoundException(`El usuario con id ${id} no existe`)

    return user;
  }

  async findOneByUsername(username: string ){
    /* const user = await this._userRepository.findOneBy({
      username
    }) */
   const user = await this._userRepository
   .createQueryBuilder('user')
   .select(['user.id','user.username'])
   .addSelect(['user.password'])
   .where({ username })
   .getOne()

    if(!user) throw new NotFoundException(`Usario o contrasena incorrecta`)
    return user

  }

  async findOneFull(id: string){
    const user = await this._userRepository.findOne({
      where: { id },
      relations: ['role','role.permissions']
    })

    return user;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
   try {
    let role;
    if(updateUserDto.role){
        role = await this.findRole(updateUserDto.role)
    }
    const user = await this._userRepository.preload(
      {id,
      ...updateUserDto,
        role
    }
    )

    if(!user) throw new NotFoundException(`El usuario con id ${id} no existe`)

    await this._userRepository.save(user)
    return user;
   } catch (error) {
    
   }
  }

  async enable2FA(id: string){
      const user = await this.findOne(id);
      if(!user) throw new BadRequestException();
      const secretOtp = await secondFA(id,user.username);
      const user2FA = await this._userRepository.update(id,{secret: secretOtp.secret })
      return {qr: secretOtp.qr}

  }

  async remove(id: string) {
    const user = await this._userRepository.findOneBy({ id })
    if(!user) throw new BadRequestException();

    const removeUser = await this._userRepository.remove(user)
    return removeUser;
  }

  async findRole(id: string ){

    const role = this._accessControlService.findRole(id)
        if(!role) {
          throw new NotFoundException()
        }
        return role
  }
}
