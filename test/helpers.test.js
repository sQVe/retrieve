import {
  combineUrls,
  combineContainers,
  createQuery,
  getResolveMethodName,
  resolveResponse,
} from '../src/helpers'
import { falsyValues } from './setup/constants'

const resolveMethodMap = {
  ArrayBuffer: 'arrayBuffer',
  Blob: 'blob',
  FormData: 'formData',
  JSON: 'json',
  Response: 'response',
  Text: 'text',
}

describe('Helpers', () => {
  describe('combineContainers', () => {
    it('should return a combined container', () => {
      const a = { url: 'a', init: { a: true }, options: { a: true } }
      const b = {
        url: 'b',
        init: { a: false, b: true },
        options: { a: false, b: true },
      }

      expect(combineContainers(a)(b)).toEqual({
        url: `${a.url}/${b.url}`,
        init: { ...a.init, ...b.init },
        options: { ...a.options, ...b.options },
      })
    })

    it('should handle missing values gracefully', () => {
      expect(combineContainers({})({})).toEqual({
        url: '',
        init: {},
        options: {},
      })
    })
  })

  describe('combineUrls', () => {
    it('should return combined urls', () => {
      expect(combineUrls(['https://www.foo.com', 'bar', 'baz'])).toBe(
        'https://www.foo.com/bar/baz'
      )
    })

    it('should sanitize leading and ending slashes between urls', () => {
      expect(combineUrls(['foo/', 'bar'])).toBe('foo/bar')
      expect(combineUrls(['foo', '/bar'])).toBe('foo/bar')
      expect(combineUrls(['foo/', '/bar'])).toBe('foo/bar')
    })

    it('should not sanitize leading slash of first url', () => {
      expect(combineUrls(['foo', 'bar'])).toBe('foo/bar')
      expect(combineUrls(['/foo', 'bar'])).toBe('/foo/bar')
    })

    it('should not sanitize leading slash of last url', () => {
      expect(combineUrls(['foo', 'bar'])).toBe('foo/bar')
      expect(combineUrls(['foo', 'bar/'])).toBe('foo/bar/')
    })

    it('should return empty string when given no valid urls', () => {
      expect(combineUrls(undefined)).toBe('')
      expect(combineUrls([])).toBe('')
      expect(combineUrls(falsyValues)).toBe('')
    })

    it('should return first url when given a single valid url', () => {
      expect(combineUrls(['foo'])).toBe('foo')
      expect(combineUrls(['/foo'])).toBe('/foo')
      expect(combineUrls(['foo/'])).toBe('foo/')
      expect(combineUrls(['/foo/'])).toBe('/foo/')
    })
  })

  describe('createQuery', () => {
    it('should return query string', () => {
      const query = createQuery({ foo: true, bar: 'baz' })

      expect(query).toBe('foo=true&bar=baz')
    })

    it('should return empty query', () => {
      falsyValues.forEach(x => {
        const query = createQuery(x)

        expect(query).toBe('')
      })
    })
  })

  describe('getResolveMethodName', () => {
    it('should return matched method name', () => {
      Object.entries(resolveMethodMap).forEach(([type, method]) => {
        expect(getResolveMethodName(type)).toBe(method)
      })
    })

    it('should return resolveAs when no match found', () => {
      expect(getResolveMethodName('foo')).toBe('foo')
      expect(getResolveMethodName('BAR')).toBe('BAR')
      expect(getResolveMethodName('fooBar')).toBe('fooBar')
    })
  })

  describe('resolveResponse', () => {
    const fooMock = jest.fn(() => 'foo')

    beforeEach(fooMock.mockClear)

    Object.entries(resolveMethodMap)
      .filter(([type]) => !['JSON', 'Response'].includes(type))
      .forEach(([type, method]) => {
        const mock = fooMock
        const res = { [method]: mock }

        it(`should resolve as ${type}`, () => {
          expect(resolveResponse(res, type)).resolves.toBe('foo')
          expect(mock).toHaveBeenCalledTimes(1)
        })
      })

    it('should resolve as JSON', () => {
      const textMock = fooMock
      const cloneMock = jest.fn(() => ({ text: textMock }))
      const jsonMock = fooMock
      const res = { json: jsonMock, clone: cloneMock }

      expect(resolveResponse(res, 'JSON')).resolves.toBe('foo')
      expect(textMock).toHaveBeenCalledTimes(1)
      expect(cloneMock).toHaveBeenCalledTimes(1)
      expect(jsonMock).toHaveBeenCalledTimes(1)
    })

    it('should return undefined when resolved as JSON with empty response', () => {
      const textMock = jest.fn(() => '')
      const cloneMock = jest.fn(() => ({ text: textMock }))
      const jsonMock = fooMock
      const res = { json: jsonMock, clone: cloneMock }

      expect(resolveResponse(res, 'JSON')).resolves.toBeUndefined()
    })

    it('should resolve as Response', () => {
      const res = 'foo'

      expect(resolveResponse(res, 'Response')).resolves.toBe(res)
    })
  })
})
