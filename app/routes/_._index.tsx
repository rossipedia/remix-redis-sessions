import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { Form, Link, redirect, useLoaderData } from '@remix-run/react';
import { auth } from '~/auth.server';
import { cookie, redis } from '~/session.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await auth.isAuthenticated(request);

  return {
    user,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const fd = await request.formData();
  const intent = String(fd.get('intent'));
  if (intent === 'invalidate') {
    const sessionId = await cookie.parse(request.headers.get('Cookie') ?? '');
    if (sessionId) {
      await redis.del(sessionId);
    }
  }

  throw redirect('/', { status: 303 });
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  if (user) {
    return (
      <div className="card">
        <div className="card-body prose">
          <h2 className="card-header">Welcome back!</h2>
          <p>
            You are logged in as <code>{user.username}</code>
          </p>
          <Form method="post" action="/logout">
            <button className="btn btn-error">Sign Out</button>
          </Form>
          <Form method="post" action="/?index">
            <button
              className="btn btn-secondary"
              name="intent"
              value="invalidate"
            >
              Invalidate Redis Data
            </button>
          </Form>
        </div>
      </div>
    );
  }
  return (
    <Link to="/login" className="btn">
      Log In
    </Link>
  );
}
