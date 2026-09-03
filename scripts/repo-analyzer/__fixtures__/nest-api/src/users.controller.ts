import {Controller, Get, Post} from '@nestjs/common';
@Controller('api/users')
export class UsersController {
  @Get(':id') findOne() {}
  @Post() create() {}
}
