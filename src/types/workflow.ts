import {
  Action,
  ActionContext,
  ActionName,
  ActionType,
  DecisionActionParameters,
  EchoActionParameters,
  EventActionParameters,
  LoopActionParameters,
  MergeActionParameters,
  MockActionParameters,
  ModuleActionParameters,
  NotifyActionParameters,
  QueryActionParameters,
  ReferrerActionParameters,
  RequestActionParameters,
  ReturnActionParameters,
  StoreActionParameters,
  ScriptActionParameters,
  SplitActionParameters,
  StartActionParameters,
  TemplateActionParameters,
  TokenActionParameters,
  TransformActionParameters,
  WaitActionParameters,
  ActionResponseStatus
} from './action'
import { ISO8601DateTime, JSONData, UUID } from './common'

export type DispatchAttributes = {
  workflowId: UUID
  callerId: UUID
  processId: UUID
  accountId: UUID
  serviceId: UUID
  // name: string
}

export interface DecisionAction extends Action {
  type: `${ActionType.DECISION}`
  parameters: DecisionActionParameters
}

export interface EchoAction extends Action {
  type: `${ActionType.ECHO}`
  parameters: EchoActionParameters
}

export interface EventAction extends Action {
  type: `${ActionType.EVENT}`
  parameters: EventActionParameters
}

export interface LoopAction extends Action {
  type: `${ActionType.LOOP}`
  parameters: LoopActionParameters
}

export interface MergeAction extends Action {
  type: `${ActionType.MERGE}`
  parameters: MergeActionParameters
}

export interface MockAction extends Action {
  type: `${ActionType.MOCK}`
  parameters: MockActionParameters
}

export interface ModuleAction extends Action {
  type: `${ActionType.MODULE}`
  parameters: ModuleActionParameters
}

export interface NotifyAction extends Action {
  type: `${ActionType.NOTIFY}`
  parameters: NotifyActionParameters
}

export interface QueryAction extends Action {
  type: `${ActionType.QUERY}`
  parameters: QueryActionParameters
}

export interface ReferrerAction extends Action {
  type: `${ActionType.REFERRER}`
  parameters: ReferrerActionParameters
}

export interface RequestAction extends Action {
  type: `${ActionType.REQUEST}`
  parameters: RequestActionParameters
}

export interface ReturnAction extends Action {
  type: `${ActionType.RETURN}`
  parameters: ReturnActionParameters
}

export interface StoreAction extends Action {
  type: `${ActionType.STORE}`
  parameters: StoreActionParameters
}

export interface ScriptAction extends Action {
  type: `${ActionType.SCRIPT}`
  parameters: ScriptActionParameters
}

export interface SplitAction extends Action {
  type: `${ActionType.SPLIT}`
  parameters: SplitActionParameters
}

export interface StartAction extends Action {
  type: `${ActionType.START}`
  parameters: StartActionParameters
}

export interface TemplateAction extends Action {
  type: `${ActionType.TEMPLATE}`
  parameters: TemplateActionParameters
}

export interface TokenAction extends Action {
  type: `${ActionType.TOKEN}`
  parameters: TokenActionParameters
}

export interface TransformAction extends Action {
  type: `${ActionType.TRANSFORM}`
  parameters: TransformActionParameters
}

export interface WaitAction extends Action {
  type: `${ActionType.WAIT}`
  parameters: WaitActionParameters
}

export type Actions =
  | DecisionAction
  | EchoAction
  | EventAction
  | LoopAction
  | MergeAction
  | MockAction
  | ModuleAction
  | NotifyAction
  | QueryAction
  | ReferrerAction
  | RequestAction
  | ReturnAction
  | StoreAction
  | ScriptAction
  | SplitAction
  | StartAction
  | TemplateAction
  | TokenAction
  | TransformAction
  | WaitAction

export interface WorkflowDefinition {
  [k: string]: Actions
}

export type WorkflowModel = {
  id: UUID
  serviceId: UUID
  createdAt?: ISO8601DateTime
  updatedAt?: ISO8601DateTime
  label?: string
  hasWebhook?: boolean
  summary?: string
  definition: WorkflowDefinition
}

export type WorkflowCreateInput = {
  serviceId: UUID
  label?: string
  summary?: string
  definition: JSONData
}


export type WorkflowUpdateInput = {
  id: UUID
  serviceId?: UUID
  label?: string
  summary?: string
  definition: JSONData
}

export type WorkflowTriggerInput = {
  id: UUID
  payload?: JSONData
}

export type WorkflowTriggerResponse = {
  status: ActionResponseStatus
  result?: unknown
}


export interface WorkflowFailParameters {
  accountId: UUID
  workflowId: UUID
}

export interface WorkflowCompleteParameters {
  accountId: UUID
  workflowId: UUID
}

export interface ScheduleEventParameters {
  accountId: UUID
  workflowId: UUID
}

export interface WaitEventParameters {
  delay: number
  action: ActionName
  workflow: WorkflowDefinition
  context: ActionContext
  attributes: DispatchAttributes
  source: {
    name: ActionName
    type: ActionType
  }
}

export interface LoopEventParameters {
  count: number
  index: number
  action: ActionName
  workflow: WorkflowDefinition
  context: ActionContext
  attributes: DispatchAttributes
}
