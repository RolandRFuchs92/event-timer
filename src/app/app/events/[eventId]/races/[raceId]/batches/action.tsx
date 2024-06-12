'use server'

import { action } from '@/lib/safeAction'
import z from 'zod'
import { getRace } from '../action'
import { unstable_noStore } from 'next/cache'


export const getBatches = action(z.string(), async (input) => {
  unstable_noStore();
  const race = await getRace(input);

  return race.batches;
})
