import {Role} from "../../../share/models/accounts";


export interface Account{
  accountId: number;
  username: string;
  password: string;
  email?: string;
  userRoles? : Role[];
}
