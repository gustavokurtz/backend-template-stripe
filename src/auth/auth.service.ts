import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();
  private JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

  async register(data: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error('Usuário já existe');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
    });

    const token = this.generateToken(user.id);

    return { token };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const match = await bcrypt.compare(data.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Senha inválida');

    const token = this.generateToken(user.id);
    return { token };
  }

  private generateToken(userId: string) {
    return jwt.sign({ sub: userId }, this.JWT_SECRET, { expiresIn: '7d' });
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { sub: string };
      const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
      return user;
    } catch {
      return null;
    }
  }


  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  
}
