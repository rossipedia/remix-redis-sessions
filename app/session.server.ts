import { createCookie, createSessionStorage, redirect } from '@remix-run/node';
import { Redis } from 'ioredis';

export const redis = new Redis('redis://localhost');

export const cookie = createCookie('session', {
  // 20 minutes
  maxAge: 20 * 60,
  secure: true,
  httpOnly: true,
  secrets: ['mysessionsecret'],
});

export const sessionStorage = createSessionStorage({
  cookie,
  async createData(data, expires) {
    const id = crypto.randomUUID();
    if (expires) {
      await redis.set(id, JSON.stringify(data), 'EX', expires.getTime());
    } else {
      await redis.set(id, JSON.stringify(data));
    }
    return id;
  },
  async readData(id) {
    const logout = async () => {
      throw redirect('/login', {
        headers: {
          'Set-Cookie': await cookie.serialize('', { maxAge: 0 }),
        },
      });
    };

    const raw = await redis.get(id);
    if (!raw) {
      await logout();
      return;
    }

    try {
      return JSON.parse(raw.toString());
    } catch {
      await logout();
    }
  },
  async updateData(id, data, expires) {
    if (expires) {
      await redis.set(id, JSON.stringify(data), 'EX', expires.getTime());
    } else {
      await redis.set(id, JSON.stringify(data));
    }
  },
  async deleteData(id) {
    await redis.del(id);
  },
});

const { getSession, commitSession, destroySession } = sessionStorage;
export { getSession, commitSession, destroySession };
