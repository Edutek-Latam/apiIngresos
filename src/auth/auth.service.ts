import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { comparePwd } from 'src/common/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService
  ){}


  async login(loginAuthDto: LoginDto) {
    
        const user = await this._userService.findOneByUsername(loginAuthDto.username);
        if(user){
          const isValid = await comparePwd(loginAuthDto.password,user.password)
          if(isValid){
            return user
          }
          throw new UnauthorizedException()
        }
       
  }
}
