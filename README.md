> 📬 **righttp** - An opinionated easy-to-use functional Fetch API wrapper.

## Why

- Functional and easy-to-use.
- Opinionated with sensible defaults.
- Decreases boilerplate code.
- Less than **1kb** in size.

## Install

Using [npm][npm-install]:

```sh
$ npm install righttp
```

Using [yarn][yarn-install]:

```sh
$ yarn add righttp
```

Build from source:

```sh
$ git clone git@github.com:sQVe/righttp.git
$ cd righttp/
$ npm install && npm run build
```

**Note:** `righttp` doesn't provide any polyfills for the **Fetch API** or new
**ES6** features to save size for supported enviroments.

## API

**righttp** is available as a CommonJS and ES module.

```js
import righttp from 'righttp'

const ROOT_URL = 'https://foobar.baz'

const run = async () => {
  const characters = righttp(ROOT_URL + '/characters')
  const id = 100

  // Get all existing characters.
  await characters.get()

  // Create our first character.
  await characters.post('', { id, name: 'totoro', awesome: false })

  // Get our character.
  await characters.get(id)

  // Update character awesomeness.
  await characters.put(id, { awesome: true })

  // Remove character.
  return characters.del(id)
}
```

---

#### `righttp(url, init, options)`

TODO: Describe that this is an actual factory...

###### Parameters

- **`url`** (string) - The URL to preset to the request.
- **`init`** _(object)_ - A fetch init containing any custom settings to
  preset to the request. See [Fetch API][fetch-api] for further details about
  possible options.

  By default set to:

  ```typescript
  {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  }
  ```

- **`options`** _(object)_ - An object containing internal options to preset to the request.

  Possible options are:

  - `payloadAs` _(function)_ -

  - `resolveAs` _(string)_ - Resolve response as either `ArrayBuffer`, `Blob`, `FormData`, `JSON`, `Response` or `Text`.

  - `onResponse` _(function)_ -

  By default set to:

  ```typescript
  {
    payloadAs: x => JSON.stringify(x),
    resolveAs: 'JSON',
  }
  ```

###### Returns

TODO: How should we document the API that it returns?

###### Example

TODO: Write example.

```typescript
{
  distance: number,
  name: string,
  rgb: [number, number, number]
}
```

#### `del(url, payload)`

TODO: Write description. Clearly state that this is provided by the factory `righttp` above.

## Contributing

###### Bug reports & feature requests

Your contribution is greatly appreciated. Please use the [issue tracker][issue-tracker] to report bugs or make feature requests.

###### Developing

Pull requests are more than welcome. The following will get you started:

1. [Fork][how-to-fork] this repository to your own GitHub account and then [clone][how-to-clone] it to your local device.
2. Run `npm install` in the created directory to install all necessary dependencies.

###### Style guide & conventions

Follow [functional programming][functional-programming] best practices - use pure functions and composition when possible.
Write commit messages with [Conventional Commits][conventional-commits] which enables [`semantic-release`][semantic-release] to do all kinds of automatic goodies (release, changelong and more). Linting and formatting is heavily enforced on both `pre-commit` and on push to [GitHub Actions][github-actions].

## License

```
MIT License
```

<!-- References -->

[conventional-commits]: https://www.conventionalcommits.org
[fetch-api]: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
[functional-programming]: https://en.wikipedia.org/wiki/Functional_programming
[github-actions]: https://github.com/sQVe/righttp/actions
[how-to-clone]: https://help.github.com/articles/cloning-a-repository
[how-to-fork]: https://help.github.com/articles/fork-a-repo
[issue-tracker]: https://github.com/sQVe/righttp/issues
[npm-install]: https://docs.npmjs.com/cli/install
[semantic-release]: https://github.com/semantic-release/semantic-release
[yarn-install]: https://yarnpkg.com/en/docs/getting-started
