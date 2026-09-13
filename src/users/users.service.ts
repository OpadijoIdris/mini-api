import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { SafeUser, User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(dto: CreateUserDto & { password: string }): User {
    const exists = this.users.find((u) => u.email === dto.email);
    if (exists) throw new ConflictException('Email already registered');

    const user: User = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      password: dto.password,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  findAll(): SafeUser[] {
    return this.users.map(this.toSafeUser);
  }

  findOne(id: string): SafeUser {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    return this.toSafeUser(user);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  update(id: string, dto: UpdateUserDto): SafeUser {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, dto);
    return this.toSafeUser(user);
  }

  remove(id: string): void {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
  }

  private toSafeUser(user: User): SafeUser {
    const { password, ...safe } = user;
    return safe;
  }
}
