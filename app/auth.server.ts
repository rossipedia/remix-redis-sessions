import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';
import { FormStrategy } from 'remix-auth-form';
import invariant from 'tiny-invariant';

const auth = new Authenticator<{ username: string }>(sessionStorage);
auth.use(
  new FormStrategy(async ({ form }) => {
    const username = String(form.get('username'));
    const password = String(form.get('password'));

    invariant(username);
    // DON'T DO THIS IN PRODUCTION
    invariant(password === 'password');

    return { username };
  }),
  'form'
);

export { auth };
