export type TUserAuth = {
  id?: string;
  _id?: string;
  userName: string;
  email?: string;
  phone?: string;
  user: string;
  timezone?: string;
  expired?: string;
  timeToNotify?: string;
  isLogged?: boolean;
};

export type TUserAuthPhone = Omit<TUserAuth, 'email'> & { phone: string, email?: string };
