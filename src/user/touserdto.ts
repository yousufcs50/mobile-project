import { User } from './entity/user.entity';
import { UserDto } from './dtos/User.dto';

export const toUserDto = (data: User): UserDto => {
  const { id, username, email } = data;
  let userDto: UserDto = { id, username, email };
  return userDto;
};
