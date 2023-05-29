import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const email = await this.UsersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (email) return 'el email ya existe';

    const password = await hash(createUserDto.password, 10);
    const data = this.UsersRepository.create({ ...createUserDto, password });
    this.UsersRepository.save(data);
    return 'se a registado correctamente';
  }

  findAll() {
    return this.UsersRepository.find();
  }

  findOne(id: number) {
    return this.UsersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hashPass = await hash(updateUserDto.password, 10);
    return this.UsersRepository.update(
      { id },
      { ...updateUserDto, password: hashPass },
    );
  }

  remove(id: number) {
    return this.UsersRepository.delete({ id });
  }
}
