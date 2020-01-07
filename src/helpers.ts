import {
  Container,
  Init,
  Options,
  QueryParams,
  ResolveMethod,
  ResponseResolve,
} from './types'
import { isString } from './utility'

/** combineUrls :: [String] -> String */
export const combineUrls = (urls: string[]) => {
  const addTrailingSlash = (x: string) => (x.endsWith('/') ? x : `${x}/`)
  const removeLeadingSlash = (x: string) =>
    x.startsWith('/') ? x.substring(1) : x

  const validUrls = (urls || []).filter(x => isString(x) && x.length > 0)

  if (validUrls.length === 0) return ''
  if (validUrls.length === 1) return validUrls[0]

  return validUrls.reduce(
    (acc, url) => addTrailingSlash(acc) + removeLeadingSlash(url)
  )
}

/** createQuery :: {k:v} -> String */
export const createQuery = (params: QueryParams) => {
  const arr = Object.entries(params || {}).map(([k, v]) =>
    [k, encodeURIComponent(v)].join('=')
  )

  return arr.length ? arr.join('&') : ''
}

/** getResolveMethodName :: String -> String */
export const getResolveMethodName = (resolveAs: ResponseResolve) => {
  const caseSafeResolveAs = resolveAs.toLowerCase()
  const methodNameLookup: { [index: string]: ResolveMethod } = {
    arraybuffer: 'arrayBuffer',
    blob: 'blob',
    formdata: 'formData',
    json: 'json',
    response: 'response',
    text: 'text',
  }

  return methodNameLookup[caseSafeResolveAs] || resolveAs
}

/** resolveMethod :: (Response, String) -> Promise a */
export const resolveResponse = async (
  res: Response,
  resolveAs: ResponseResolve
) => {
  const resolveMethodName = getResolveMethodName(resolveAs)

  if (resolveMethodName === 'response') return res
  if (resolveMethodName === 'json') {
    const text = await res.clone().text()

    if (text.length === 0) return undefined // eslint-disable-line fp/no-nil
    return res.json()
  }

  return res[resolveMethodName]()
}

/** combineContainers :: {a} -> {a} -> {a} */
export const combineContainers = (a: Container) => (
  b: Container
): Container => ({
  url: combineUrls([a.url, b.url]),
  init: { ...(a.init || {}), ...(b.init || {}) },
  options: { ...(a.options || {}), ...(b.options || {}) },
})

/** preset :: ({a} -> Promise b) -> {a} -> Promise b */
export const preset = (
  fn: (container: Container) => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
) => (container: Container) => (url: string, init: Init, options: Options) =>
  fn(combineContainers(container)({ url, init, options }))
