import { IsNumber, IsString, Length } from "class-validator";

export class TotpDTO{

    @IsString()
    secret: string

    @IsString()
    @Length(6)
    otp: string
}