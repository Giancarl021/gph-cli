# template save

Saves a request with custom parameters set to simplify long commands

## Usage

```bash
gph-cli template save <unit | list | massive> <...custom-arguments> <flags>
```

## Flags

* `--credentials` | `-c`: The credentials ID to be saved on the template. If omitted will set to runtime default. Value: `<credentials-id>`;
* `--output` | `-o`: The output path to the template file to be created;
* `--...custom-flags`: Any custom flag to be added to the request. Value: `<...any>`.

