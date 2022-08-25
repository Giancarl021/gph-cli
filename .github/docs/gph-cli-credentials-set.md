# credentials set

Creates or updates a credential

## Usage

```bash
gph-cli credentials set <key> <flags>
```

## Flags

* `--client-id` | `-c`: The Azure App Registration Client ID. Value: `<client-id>`;
* `--client-secret` | `-s`: The Azure App Registration Client Secret. Value: `<client-secret>`;
* `--tenant-id` | `-t`: The Azure App Registration Tenant ID. Value: `<tenant-id>`;
* `--delegated` | `-d`: Set the authentication process for this credentials as delegated (user-based login). Default false;
* `--no-delegated` | `--no-d`: Set the authentication process for this credentials as application (application-based login). Default true;
* `--force` | `-f`: If a credential with the same key already exists, overwrite.

