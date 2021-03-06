import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const bundleTarget = process.env.BUILD_BUNDLE
const externalDependencies = [
  'core-js',
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const isArrayLike = (x) => x != null && typeof x[Symbol.iterator] === 'function'
const isNil = (...xs) => xs.some((x) => x == null)
const isObjectLike = (x) => x != null && typeof x === 'object'
const isSameType = (x, y) => !isNil(x, y) && x.constructor === y.constructor
const sanitizeBundle = ({ type, ...rest }) => rest
const removeRelativePath = (dep) => dep.replace(/^(\.{1,2}\/)+/, '')

const presetBundleDefaults = (defaults) => (opts) =>
  Object.entries({ ...defaults, ...opts }).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]:
        isObjectLike(v) && isSameType(v, defaults[k])
          ? isArrayLike(v)
            ? [...defaults[k], ...v]
            : { ...defaults[k], ...v }
          : v,
    }),
    {}
  )

const external = (dependencies) => (id) =>
  dependencies
    .map((dep) => removeRelativePath(id).startsWith(dep))
    .some(Boolean)

const bundle = presetBundleDefaults({
  external: external(externalDependencies),
  input: 'src/index.ts',
  output: { exports: 'named', indent: false },
  plugins: [nodeResolve({ extensions }), commonjs(), json()],
  treeshake: true,
})

const bundles = [
  bundle({
    output: { format: 'cjs', file: `lib/${pkg.name}.js` },
    plugins: [babel({ extensions })],
    type: 'cjs',
  }),
  bundle({
    output: { format: 'cjs', file: `lib/${pkg.name}.min.js` },
    plugins: [babel({ extensions }), terser()],
    type: 'cjs',
  }),
  bundle({
    output: { format: 'es', file: `lib/${pkg.name}.es.js` },
    plugins: [babel({ extensions })],
    type: 'es',
  }),
]

export default (() =>
  [
    ...(bundleTarget != null
      ? bundles.filter((x) => x.type === bundleTarget)
      : bundles),
  ].map(sanitizeBundle))()
