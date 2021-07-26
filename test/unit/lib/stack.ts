import { loadStackSchema } from 'src/lib/stack'

describe('Stack loader', () => {
  test('loadStackSchema() loads schema ', async () => {
    const res = await loadStackSchema('../../test/mocks/sample.ts')
    expect(res).toEqual({ foo: 'bar' })
  })
})
