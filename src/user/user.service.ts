import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) 
    private _userRepository: Repository<User>
  ){}

  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  async findAll() {
    return await this._userRepository.find();
  }

  async findOne(id: string) {
    return await this._userRepository.findOne( { 
      where: {id} 
    } );
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
