import {User} from "../domain/user";
import {UserDto} from "./user.dto";

export const fetchUsers = (x: string): User[] => { // fails
  return []

}


export const saveUser = (x: UserDto): User[] => { // shall fail: UserDto is not Domain
  return []

}

export const updateUser = (x: User): User[] => { // shall pass
  return []

}
