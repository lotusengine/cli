import { StackModel } from '@lotusengine/types'

// Default export should export a valid Stack
export default async () => {
  const helloWorldStack: StackModel = {
    service: {
      id: 'helloWorldService',
      data: {}
    },
    workflows: [],
    collections: [],
    views: []
  }

  return helloWorldStack
}
