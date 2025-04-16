import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { RequestWithUser } from './request-with-user';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

@UseGuards(JwtAuthGuard)
@Get('me')
async getProfile(@Req() req: RequestWithUser) {
  const userId = req.user?.id || req.user?.sub;

  if (!userId) {
    throw new Error('Usuário não autenticado');
  }

  const user = await this.authService.findUserById(userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isPaid: user.isPaid,
  };
}
}
