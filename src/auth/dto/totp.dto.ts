import { IsNumber, IsString, Length } from "class-validator";

export class TotpDTO{

    @IsString()
    id: string

    @IsString()
    @Length(6)
    otp: string
}