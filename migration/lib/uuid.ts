// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/uuid` if it exists or add ... Remove this comment to see the full error message
import { v1 as uuid } from 'uuid'

export const isValidId = (id: any) => String(id).match(
  /([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}){1}/
)

export const generateId = () => uuid()
