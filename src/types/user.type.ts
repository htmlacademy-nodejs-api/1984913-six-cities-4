import { UserStatus } from '../utils/constants.js';

export type User = {
  name: string
  email: string
  avatarUrl: string
  userStatus: UserStatus
  }
