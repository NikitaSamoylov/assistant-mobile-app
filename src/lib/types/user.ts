export type TUserAuth = {
  id?: string;
  _id?: string;
  userName: string;
  email?: string;
  phone?: string;
  user: string;
  timezone?: string;
  expired?: string;
  tariff?: string;
  timeToNotify?: string;
  isLogged?: boolean;
  nextTariff?: string;
  isNextTariffPayed?: boolean;
};

export type TUserAuthPhone = Omit<TUserAuth, 'email'> & { phone: string, email?: string };
