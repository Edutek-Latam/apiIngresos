import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _jwtService: JwtService
  ){}

   async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.getToken(request);
    if(!token) throw new UnauthorizedException();
    try {
      const payload = await this._jwtService.verifyAsync(token,{secret:'rAkEymenIanATeNELDERNEGLADVicI'})
    } catch (error) {
      console.error(error)
      throw new UnauthorizedException()
    }
    return true;
  }

  private getToken(request: Request){
    const [type,token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token: undefined;
  }
}
