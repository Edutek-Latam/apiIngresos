import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { resourceUsage } from 'process';
import { encript } from 'src/common/utils/bcrypt';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) 
    private _userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    const password = encript(createUserDto.password);
    //console.log(password)
    try {
      const newUser =  this._userRepository.create({
        ...createUserDto,
        password
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
   .select(['user.username'])
   .addSelect(['user.password'])
   .where({ username })
   .getOne()

    if(!user) throw new NotFoundException(`Usario o contrasena incorrecta`)
    return user

  }

  async update(id: string, updateUserDto: UpdateUserDto) {
   try {
    const user = await this._userRepository.preload(
      {id,
      ...updateUserDto,}
    )

    if(!user) throw new NotFoundException(`El usuario con id ${id} no existe`)

    await this._userRepository.save(user)
    return user;
   } catch (error) {
    
   }
  }

  async remove(id: string) {
    const user = await this._userRepository.findOneBy({ id })
    if(!user) throw new BadRequestException();

    const removeUser = await this._userRepository.remove(user)
    return removeUser;
  }
}
