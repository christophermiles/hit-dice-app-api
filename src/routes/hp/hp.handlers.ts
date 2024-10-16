import type { RouteHandler } from '@hono/zod-openapi'
import type { Context } from 'hono'
import type { Variables } from '../../types'
import type { GetHitPointsAsCsvRoute, GetHitPointsRoute } from './hp.routes'
import { BadRequestError } from '../../classes/errors'
import { hitPointResultsResponseAsCsv } from '../../util/hit-point-results-response-as-csv'
import { processHitDice } from '../../util/process-hit-dice'

interface AppBindings {
  Variables: Variables
}

export const getHitPointsHandler: RouteHandler<GetHitPointsRoute, AppBindings> = (c: Context) => {
  try {
    return c.json(processHitDice(c.get('hitDiceExpressions')), 200)
  }
  catch (e) {
    throw new BadRequestError(e instanceof Error ? e.message : '')
  }
}

export const getHitPointsAsCsvHandler: RouteHandler<GetHitPointsAsCsvRoute, AppBindings> = (c: Context) => {
  try {
    return c.text(
      hitPointResultsResponseAsCsv(processHitDice(c.get('hitDiceExpressions'))),
      200,
      {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    )
  }
  catch (e) {
    throw new BadRequestError(e instanceof Error ? e.message : '')
  }
}
