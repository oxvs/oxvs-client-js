# oxvs-client

Handle OXVS Server Communication from browser.

## Installation

- Download and install `oxvs_browser.js` from the [latest release](https://github.com/oxvs/oxvs-client-js/releases/latest)

## Usage

To use the client, you need to first downlod it and include it in your HTML file.

```html
<script src="./oxvs_browser.js"></script>
```

After the file is included, a global `oxvscs` object will be available. This object contains configuration options and methods to communicate with the server.

Before using the client, make sure to check if the client object exists yet.

```ts
if (typeof oxvscs === 'undefined') {
  console.log('oxvscs is not defined yet.');
}
```

Once avaliable, call functions by using the `oxvscs` object.

```ts
oxvscs.storage.get({ 
    ouid: '@user:test!o.host[server.oxvs.net]', 
    token: 'token', 
    id: 'id-example' 
}).then((response) => {
    console.log(response)
}).catch((err) => { console.log(err) })
```

## Notes

- The client is not intended to be used in production environments yet
- [Documentation](https://browser.docs.oxvs.net) may not be complete
- More information is avaliable in [oxvs/oxvs-server](https://github.com/oxvs/oxvs-server#readme)