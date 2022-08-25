# template run

Runs a request from a template file

## Usage

```bash
gph-cli template run <path/to/template-file.json> <...custom-arguments> <flags>
```

## Flags

* `--credentials` | `-c`: The credentials ID to be used on the request. If omitted will use the template value. Value: `<credentials-id>`;
* `--...custom-flags`: Any custom flag to be added to the request. Value: `<...any>`.

