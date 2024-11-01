import { ActionFunctionArgs } from '@remix-run/node';
import { auth } from '~/auth.server';

export async function action({ request }: ActionFunctionArgs) {
  await auth.logout(request, {
    redirectTo: '/',
  });
}
