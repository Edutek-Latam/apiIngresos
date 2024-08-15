import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { comparePwd } from 'src/common/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService
  ){}


  async login(loginAuthDto: LoginDto) {
    
        const user = await this._userService.findOneByUsername(loginAuthDto.username);
        if(!user) throw new UnauthorizedException()

        if(user){
          const isValid = await comparePwd(loginAuthDto.password,user.password)
          if(isValid){
            const payload = {username: user.username, isActive: user.isActive};
            const token =  await this.getToken(payload);

            return { access_token: token }
          }
          throw new UnauthorizedException(`Usario o contrasena incorrecta`)
        }
       
  }

   async getToken(payload: any){
      const token = await this._jwtService.signAsync(payload)
      return token
  }
}
