import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dtos/CreateUser.dto';
import { RegistrationStatus } from './RegistrationStatus';
import { LoginUserDto } from 'src/user/dtos/login.dto';
import { UserDto } from 'src/user/dtos/User.dto';
import {JwtPayload} from './JwtPayload'
@Injectable()
export class AuthService {
    constructor(private  usersService: UserService, private  jwtService: JwtService,  ) {}

async register(userDto: CreateUserDto): 
Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
        success: true,   
        message: 'user registered',
    };
    try {
        await this.usersService.create(userDto);
    } catch (err) {
        status = {
            success: false,        
            message: err,
        };    
    }
    return status;  
}

async login(loginUserDto: LoginUserDto) {    
    // find user in db    
    const user = await this.usersService.findByLogin(loginUserDto);
    
    // generate and sign token    
    const token = this._createToken(user);
    
    return {
        username: user.username, ...token,    
    };  
}

private _createToken({ username }: UserDto): any {
    const user: JwtPayload = { username };    
    const accessToken = this.jwtService.sign(user);    
    return {
        expiresIn: '60s',
        accessToken,    
    };  
}

async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);    
    if (!user) {
        throw new BadRequestException('Invalid token');    
    }    
    return user;  
}

}
