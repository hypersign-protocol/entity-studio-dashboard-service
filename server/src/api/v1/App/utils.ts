const ONE_MILLISECOND = 1000;
const ONE_SECOND = 1 * ONE_MILLISECOND;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = 60 * ONE_MINUTE;

export const TIME = {
  ONE_MILLISECOND,
  ONE_SECOND,
  ONE_MINUTE,
  ONE_HOUR,
};

// supported grant type
export enum GrantType {
  client_credentials = 'client_credentials',
}
