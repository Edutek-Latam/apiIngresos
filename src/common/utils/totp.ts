import * as speakeasy from 'speakeasy'
import { toDataURL } from 'qrcode'
import { UserService } from 'src/user/user.service'
import { User } from 'src/user/entities/user.entity'
import { Injectable } from '@nestjs/common'

/**
 * 
 * @param { string }  id - ID de usuario
 * @param  { string }  username - Username
 */
export async function secondFA(id: string, username: string){
    const secret = speakeasy.generateSecret({length:30, name:'bytesec'})
    const otpauth_url = speakeasy.otpauthURL({
         secret: secret.base32,
         issuer:'bytesec',
         label:`User:${username}`
    })

    const qr = await toDataURL(otpauth_url)
    return { secret: secret.base32,qr }
}

export function verifyOTP(secret: string, otp: string){
    console.log(secret)
    console.log(otp)
    let verify = speakeasy.totp.verify({
        secret: secret,
        encoding:'base32',
        token: otp,
        window:2
    })

    return verify
}


export class Totp2FA{
    constructor(private _userService: UserService){}

    async varifyOTP(id: string, otp: string){
        const user = await this._userService.findOne(id)

        let verify = speakeasy.totp.verify({
            secret: user.secret,
            encoding:'base32',
            token: otp,
            window:1
        })

        console.log(verify)
    }
}