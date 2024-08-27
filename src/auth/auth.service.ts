import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { comparePwd } from 'src/common/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Totp2FA, verifyOTP } from 'src/common/utils/totp';
import { TotpDTO } from './dto/totp.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { v4 as uuid   } from 'uuid'
import { access } from 'fs';

@Injectable()
export class AuthService {
  
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
    @InjectRedis() private _redis: Redis
   
  ){}


  async login(loginAuthDto: LoginDto) {
    
        const user = await this._userService.findOneByUsername(loginAuthDto.username);
        if(!user) throw new UnauthorizedException()
          //console.log(user)
        if(user){
          const isValid = await comparePwd(loginAuthDto.password,user.password)
          if(isValid){
           
            //const payload = {sub: user.id};
           /// await this._redis.set(`userid:${user.id}`,user.id,'EX',300)
           // const token =  await this.getToken(payload);
            const secretOTP =   await this.secretOTP(user.id)
            return {temp_token: secretOTP,message:'Envia el TOTP'}
           // return { access_token: token }
          }
          throw new UnauthorizedException(`Usario o contrasena incorrecta`)
        }
       
  }


  async secretOTP(userId: string){
      const secret = uuid()
      await this._redis.set(`topt_secret:${secret}`,userId, 'EX',600)
      return secret
  }

async validateSecretOTP(secret: string){
  const data = await this._redis.get(`topt_secret:${secret}`);

  if(!data) throw new UnauthorizedException()
  
    return data
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
    const {secret,otp} = totpDTO
    const id = await this.validateSecretOTP(secret)
    const user = await this._userService.findOne( id )
    const verify = await verifyOTP(user.secret, otp)
    if(verify){
      const payload = {sub: user.id};
      const token =  await this.getToken(payload);
      this._redis.del(`topt_secret:${secret}`)
      return { access_token: token }
    }

      console.log(verify)
  }
}
