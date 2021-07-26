// @ts-expect-error ts-migrate(7016) FIXME: Try `npm install @types/bytes` if it exists or add... Remove this comment to see the full error message
import bytes from 'bytes'
// import { Response } from 'node-fetch'
// import LotusError from './lotus-error'

class LotusError extends Error {
  code: any
  meta: any
  constructor({ code, message, meta }: any) {
    // console.log(JSON.stringify({ message, meta }, null, 2))
    super(message)
    this.code = code
    this.meta = meta
  }
}

class GraphQLAPIError extends LotusError {
  constructor(errors: any) {
    super({
      code: 'GRAPHQL_ERROR',
      meta: { errors },
      message: 'GraphQL returned an error'
    })
  }
}

class CantReadDirError extends LotusError {
  constructor(dir: any) {
    super({
      code: 'CANT_READ_DIR_ERROR',
      meta: { dir },
      message: "Can't read directory"
    })
  }
}

class CantParseJSONFileError extends LotusError {
  constructor(file: any) {
    super({
      code: 'CANT_PARSE_JSON_FILE_ERROR',
      meta: { file },
      message: "Can't parse json file"
    })
  }
}

class CantParseYAMLFileError extends LotusError {
  constructor(file: any) {
    super({
      code: 'CANT_PARSE_YAML_FILE',
      meta: { file },
      message: "Can't parse yaml file"
    })
  }
}

class CantLoadModule extends LotusError {
  constructor(path: any) {
    super({
      code: 'CANT_LOAD_MODULE',
      meta: { path },
      message: `Can't load module at "${path}".`
    })
  }
}

class CantFindFileError extends LotusError {
  constructor(file: any) {
    super({
      code: 'CANT_FIND_FILE',
      meta: { file },
      message: `Can't find "${file}".`
    })
  }
}

class WorkflowNotFoundError extends LotusError {
  constructor(workflowId: any) {
    super({
      code: 'WORKFLOW_NOT_FOUND',
      meta: { workflowId },
      message: `The workflow ${workflowId} can't be found.`
    })
  }
}

class StreamNotFoundError extends LotusError {
  constructor(streamId: any) {
    super({
      code: 'STREAM_NOT_FOUND',
      meta: { streamId },
      message: `The stream ${streamId} can't be found.`
    })
  }
}

class CollectionNotFoundError extends LotusError {
  constructor(collectionId: any) {
    super({
      code: 'COLLECTION_NOT_FOUND',
      meta: { collectionId },
      message: `The collection ${collectionId} can't be found.`
    })
  }
}

class ElasticIndexCreateError extends LotusError {
  constructor(index: any) {
    super({
      code: 'ES_INDEX_CREATE_ERROR',
      meta: { index },
      message: 'Error creating index.'
    })
  }
}

class ElasticIndexBadMappingError extends LotusError {
  constructor() {
    super({
      code: 'ES_INDEX_BAD_MAPPING_ERROR',
      meta: {},
      message: 'Invalid Elasticsearch mapping.'
    })
  }
}

class ElasticInvalidTemplateError extends LotusError {
  constructor() {
    super({
      code: 'ES_INVALID_TPL_ERROR',
      meta: {},
      message: 'Invalid Elasticsearch template.'
    })
  }
}

class ElasticIndexExistsError extends LotusError {
  constructor(index: any) {
    super({
      code: 'ES_INDEX_EXISTS_ERROR',
      meta: { index },
      message: 'Elassticsearch index already exists.'
    })
  }
}

class ElasticError extends LotusError {
  constructor() {
    super({
      code: 'ES_ERROR',
      meta: {},
      message: 'Elassticsearch error.'
    })
  }
}

export {
  ElasticError,
  ElasticIndexCreateError,
  ElasticIndexBadMappingError,
  ElasticInvalidTemplateError,
  ElasticIndexExistsError,
  CantReadDirError,
  GraphQLAPIError,
  CantParseJSONFileError,
  CantParseYAMLFileError,
  CantFindFileError,
  CantLoadModule,
  StreamNotFoundError,
  CollectionNotFoundError,
  WorkflowNotFoundError
}
