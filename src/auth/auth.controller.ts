import { AuthService } from './auth.service';
import { Controller,Body,Session,Post,  Get,
    Patch,
    Delete,
    Param,
    UseGuards ,
    Request,
    NotFoundException,HttpException,HttpStatus } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/CreateUser.dto';
import { RegistrationStatus } from './RegistrationStatus';
import { LoginUserDto } from 'src/user/dtos/login.dto';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: 
        AuthService) {}

        @Post('register')  
        public async register(@Body() createUserDto: CreateUserDto,  ): Promise<RegistrationStatus> {    
            const result: 
            RegistrationStatus = await this.authService.register(createUserDto,);
            if (!result.success) {
                throw new NotFoundException(result.message);    
            }
            return result;  
        }
        @Post('login')  
        public async login(@Body() loginUserDto: LoginUserDto) {
            return await this.authService.login(loginUserDto);  
}

                    
}
