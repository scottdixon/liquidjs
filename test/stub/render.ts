import Liquid from '../../src/liquid'
import { expect } from 'chai'

const liquid = new Liquid()

export const ctx = {
  date: new Date(),
  foo: 'bar',
  arr: [-2, 'a'],
  obj: { foo: 'bar' },
  func: function () {},
  posts: [{ category: 'foo' }, { category: 'bar' }]
}

export async function test (src: string, dst: string) {
  const html = await liquid.parseAndRender(src, ctx)
  return expect(html).to.equal(dst)
}
