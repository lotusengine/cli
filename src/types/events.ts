
export enum LotusEvent {
  COLLECTION_INSERT = 'collection_insert',
  COLLECTION_MODIFY = 'collection_modify',
  COLLECTION_REMOVE = 'collection_remove',
  INSIGHT_TRIGGER = 'insight_trigger',
  ITEM_INSERT = 'item_insert',
  ITEM_MODIFY = 'item_modify',
  ITEM_REMOVE = 'item_remove',
  MODULE_DEPLOY = 'module_deploy',
  PARAMETER_INSERT = 'parameter_insert',
  PARAMETER_MODIFY = 'parameter_modify',
  PARAMETER_REMOVE = 'parameter_remove',
  SCHEDULE = 'schedule',
  SERVICE_INSERT = 'service_insert',
  SERVICE_MODIFY = 'service_modify',
  SERVICE_REMOVE = 'service_remove',
  STACK_DEPLOYED = 'stack_deployed',
  USER_EVENT = 'user_event',
  VIEW_INSERT = 'view_insert',
  VIEW_MODIFY = 'view_modify',
  VIEW_REMOVE = 'view_remove',
  WORKFLOW_COMPLETE = 'workflow_complete',
  WORKFLOW_FAIL = 'workflow_fail',
  WORKFLOW_INSERT = 'workflow_insert',
  WORKFLOW_MODIFY = 'workflow_modify',
  WORKFLOW_REMOVE = 'workflow_remove',
  WORKFLOW_TRIGGER = 'workflow_trigger'
}

export type PublicEvent =
  | LotusEvent.COLLECTION_INSERT
  | LotusEvent.COLLECTION_MODIFY
  | LotusEvent.COLLECTION_REMOVE
  | LotusEvent.INSIGHT_TRIGGER
  | LotusEvent.ITEM_INSERT
  | LotusEvent.ITEM_MODIFY
  | LotusEvent.ITEM_REMOVE
  | LotusEvent.MODULE_DEPLOY
  | LotusEvent.PARAMETER_INSERT
  | LotusEvent.PARAMETER_MODIFY
  | LotusEvent.PARAMETER_REMOVE
  | LotusEvent.SCHEDULE
  | LotusEvent.SERVICE_INSERT
  | LotusEvent.SERVICE_MODIFY
  | LotusEvent.SERVICE_REMOVE
  | LotusEvent.STACK_DEPLOYED
  | LotusEvent.USER_EVENT
  | LotusEvent.VIEW_INSERT
  | LotusEvent.VIEW_MODIFY
  | LotusEvent.VIEW_REMOVE
  | LotusEvent.WORKFLOW_COMPLETE
  | LotusEvent.WORKFLOW_FAIL
  | LotusEvent.WORKFLOW_INSERT
  | LotusEvent.WORKFLOW_MODIFY
  | LotusEvent.WORKFLOW_REMOVE
  | LotusEvent.WORKFLOW_TRIGGER