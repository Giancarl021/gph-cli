# list

Retrieve a list of entities from Graph API for specific credentials

## Usage

```bash
gph-cli list <endpoint> <flags>
```

## Flags

* `--credentials` | `-c`: The credentials ID to be used. If omitted will use the default credentials if set, otherwise will fail. Value: `<credentials-id>`;
* `--graph-version` | `-v`: The Graph API version to be used. If omitted will be 'v1.0'. Values: `v1.0` | `beta`;
* `--cache` | `-C`: Cache this specific request. Default false;
* `--body` | `-b`: The body of the request. Value: `<request-body>`;
* `--method` | `-m`: The method of the request. Default 'GET'. Values: `GET` | `POST` | `PUT` | `PATCH` | `DELETE`;
* `--headers` | `-H`: The headers of the request. Format: 'Key1: Value1; Key2: Value2; ...KeyN: ValueN'. Default ''. NOTE: The access token does not need to be set here;
* `--limit`: The limit of pages retrieved in the pagination. Value: `<page-limit>`;
* `--offset`: The number of skipped pages after saving the data in the pagination. Value: `<page-offset>`.

