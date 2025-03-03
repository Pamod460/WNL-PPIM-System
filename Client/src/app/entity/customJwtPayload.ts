import {Role} from "./role";

export interface CustomJwtPayload {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  uname?:string;
  roles?: Role[];
}
