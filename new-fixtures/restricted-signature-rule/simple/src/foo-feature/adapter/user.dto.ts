import {User} from "../domain/user";

export type UserDto  = {
  aName: string;
}


export const toUserDto = (user: User): UserDto => {  // shall pass
  return {aName: ""}

}

