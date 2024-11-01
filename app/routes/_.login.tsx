import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { auth } from '~/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  await auth.isAuthenticated(request, {
    successRedirect: '/',
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    await auth.authenticate('form', request, {
      successRedirect: '/',
      throwOnError: true,
    });
  } catch (e) {
    if (e instanceof Response) throw e;

    return {
      message: 'There was an error logging in.',
    };
  }
}

export default function LoginForm() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post" className="card bg-base-100 shadow-xl w-96">
      <div className="card-body">
        <h2 className="card-title">Login</h2>
        {actionData && <p className="text-error">{actionData.message}</p>}
        <label className="input input-bordered flex items-center gap-2">
          Username:
          <input type="text" name="username" />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          Password:
          <input type="password" name="password" />
        </label>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Submit</button>
        </div>
      </div>
    </Form>
  );
}
