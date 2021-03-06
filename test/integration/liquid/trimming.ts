import { expect } from 'chai'
import Liquid from '../../../src/liquid'

describe('LiquidOptions#trimming', function () {
  const ctx = { name: 'harttle' }

  describe('tag trimming', function () {
    it('should respect trim_tag_left', async function () {
      const engine = new Liquid({ trim_tag_left: true })
      const html = await engine.parseAndRender(' \n \t{%if true%}foo{%endif%} ')
      return expect(html).to.equal('foo ')
    })
    it('should respect trim_tag_right', async function () {
      const engine = new Liquid({ trim_tag_right: true })
      const html = await engine.parseAndRender('\t{%if true%}foo{%endif%} \n')
      return expect(html).to.equal('\tfoo')
    })
    it('should not trim value', async function () {
      const engine = new Liquid({ trim_tag_left: true, trim_tag_right: true })
      const html = await engine.parseAndRender('{%if true%}a {{name}} b{%endif%}', ctx)
      return expect(html).to.equal('a harttle b')
    })
  })
  describe('value trimming', function () {
    it('should respect trim_output_left', async function () {
      const engine = new Liquid({ trim_output_left: true })
      const html = await engine.parseAndRender(' \n \t{{name}} ', ctx)
      return expect(html).to.equal('harttle ')
    })
    it('should respect trim_output_right', async function () {
      const engine = new Liquid({ trim_output_right: true })
      const html = await engine.parseAndRender(' \n \t{{name}} ', ctx)
      return expect(html).to.equal(' \n \tharttle')
    })
    it('should respect not trim tag', async function () {
      const engine = new Liquid({ trim_output_left: true, trim_output_right: true })
      const html = await engine.parseAndRender('\t{% if true %} aha {%endif%}\t')
      return expect(html).to.equal('\t aha \t')
    })
  })
  describe('greedy', function () {
    const src = '\n {%-if true-%}\n a \n{{-name-}}{%-endif-%}\n '
    it('should enable greedy by default', async function () {
      const engine = new Liquid()
      const html = await engine.parseAndRender(src, ctx)
      return expect(html).to.equal('aharttle')
    })
    it('should respect to greedy:false by default', async function () {
      const engine = new Liquid({ greedy: false })
      const html = await engine.parseAndRender(src, ctx)
      return expect(html).to.equal('\n a \nharttle ')
    })
  })
  describe('markup', function () {
    it('should support trim using markup', async function () {
      const engine = new Liquid()
      const src = [
        '{%- assign username = "John G. Chalmers-Smith" -%}',
        '{%- if username and username.length > 10 -%}',
        '  Wow, {{ username }}, you have a long name!',
        '{%- else -%}',
        '  Hello there!',
        '{%- endif -%}'
      ].join('\n')
      const dst = 'Wow, John G. Chalmers-Smith, you have a long name!'
      const html = await engine.parseAndRender(src)
      return expect(html).to.equal(dst)
    })
    it('should not trim when not specified', async function () {
      const engine = new Liquid()
      const src = [
        '{% assign username = "John G. Chalmers-Smith" %}',
        '{% if username and username.length > 10 %}',
        '  Wow, {{ username }}, you have a long name!',
        '{% else %}',
        '  Hello there!',
        '{% endif %}'
      ].join('\n')
      const dst = '\n\n  Wow, John G. Chalmers-Smith, you have a long name!\n'
      const html = await engine.parseAndRender(src)
      return expect(html).to.equal(dst)
    })
  })
})
