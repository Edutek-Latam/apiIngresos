import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name)
  constructor(
    private _jwtService: JwtService,
     private _userService: UserService
  ){}

   async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.getToken(request);
    if(!token) throw new UnauthorizedException();
    try {
      const payload = await this._jwtService.verifyAsync(token,{secret:'rAkEymenIanATeNELDERNEGLADVicI'})
      const user = await this._userService.findOneFull(payload.sub)
      request.user = user;

    } catch (error) {
      if(error instanceof TokenExpiredError){
        const log = {name: error.name, message: error.message, expired: error.expiredAt}
        this.logger.error(JSON.stringify(log))
        throw new UnauthorizedException()
      }
      
      throw new InternalServerErrorException()
    }
    return true;
  }

  private getToken(request: Request){
    const [type,token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token: undefined;
  }
}
