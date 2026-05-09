import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get()
	findAll() {
		return this.usersService.findAllStudents();
	}
}
