import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { validate } from './validate.middleware.js';

describe('validate middleware', () => {
  it('allows normalizing query values without redefining a getter-only property', async () => {
    const req = {
      body: { name: 'abc' },
      params: {},
      query: {},
    } as any;

    Object.defineProperty(req, 'query', {
      get: () => ({ page: '1' }),
      configurable: true,
    });

    const res = {} as any;
    const next = vi.fn();

    await validate({ query: z.object({ page: z.string() }) })(req, res, next);

    expect(req.query).toEqual({ page: '1' });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
