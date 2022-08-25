# massive

Retrieve multiple entities from Graph API for specific credentials based on pattern-generated endpoints

## Usage

```bash
gph-cli massive <pattern/for/{<index>}/interpolation> <@from:<path/to/array-or-array-of-arrays.json> | 0a,0b,0c[;1a,1b,1c[;...Na,Nb,Nc]]> <flags>
```

## Flags

* `--credentials` | `-c`: The credentials ID to be used. If omitted will use the default credentials if set, otherwise will fail. Value: `<credentials-id>`;
* `--graph-version` | `-v`: The Graph API version to be used. If omitted will be 'v1.0'. Values: `v1.0` | `beta`;
* `--cache` | `-C`: Cache this specific request. Default false;
* `--body` | `-b`: The body of the request. Value: `<request-body>`;
* `--method` | `-m`: The method of the request. Default 'GET'. Values: `GET` | `POST` | `PUT` | `PATCH` | `DELETE`;
* `--headers` | `-H`: The headers of each individual request. Format: 'Key1: Value1; Key2: Value2; ...KeyN: ValueN'. Default '';
* `--batch-headers`: The headers of each Graph API $batch request. Format: 'Key1: Value1; Key2: Value2; ...KeyN: ValueN'. Default '';
* `--attempts`: The number of attempts with the same error count until failure. Value: `<number-of-attempts>`;
* `--requests-per-attempt`: The number of parallel requests sent at each cycle. Value: `<number-of-requests>`;
* `--binder-index`: The index of the array used to bind the results. Default 0. Only useful when using multiple-value interpolation. Value: `<index>`;
* `--nullify-errors` | `--nullify` | `--lossy`: If the attempts reach their limit, the pending responses will return null. Default false.

