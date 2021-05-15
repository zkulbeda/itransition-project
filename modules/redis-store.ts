import { Redis } from 'ioredis';

class RedisSessionStore {
  private redis: Redis

  private readonly keyPrefix: string

  constructor(redis: Redis, keyPrefix: string = 'sess.') {
    this.redis = redis;
    this.keyPrefix = keyPrefix;
  }

  private getKey(sessionId: string) {
    return `${this.keyPrefix}${sessionId}`;
  }

  destroy(sessionId: string, callback: (err?: Error) => void): void {
    this.redis
      .del(this.getKey(sessionId))
      .then(() => callback())
      .catch((error) => callback(error));
  }

  get(sessionId: string, callback: (err?: Error, session?: any) => void): void {
    this.redis
      .get(this.getKey(sessionId))
      .then((value) => {
        callback(undefined, JSON.parse(value ?? '{}'));
      })
      .catch((error) => callback(error, null));
  }

  set(sessionId: string, session: any, callback: (err?: Error) => void): void {
    this.redis
      .set(this.getKey(sessionId), JSON.stringify(session))
      .then(() => callback())
      .catch((err) => callback(err));
  }
}

export default RedisSessionStore;
