'use server'

import { action } from '@/lib/safeAction'
import z from 'zod'
import { getRace } from '../action'


export const getBatches = action(z.string(), async (input) => {
  const race = await getRace(input);

  return race.batches;
})
