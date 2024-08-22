import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { comparePwd } from 'src/common/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Totp2FA, verifyOTP } from 'src/common/utils/totp';
import { TotpDTO } from './dto/totp.dto';
@Injectable()
export class AuthService {
  
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
   
  ){}


  async login(loginAuthDto: LoginDto) {
    
        const user = await this._userService.findOneByUsername(loginAuthDto.username);
        if(!user) throw new UnauthorizedException()
          //console.log(user)
        if(user){
          const isValid = await comparePwd(loginAuthDto.password,user.password)
          if(isValid){
           
            const payload = {sub: user.id};
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

  /**
   * 
   * @param id 
   * @param otp 
   */
  async verify2FA(totpDTO: TotpDTO){
    const {id,otp} = totpDTO
     const user = await this._userService.findOne( id )
      const verify = await verifyOTP(user.secret, otp)
      console.log(verify)
  }
}
