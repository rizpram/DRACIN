# Provider Incident Reporter

DRACIN can turn provider playback failures into a support-ready incident report.

`POST /api/admin/incidents/report` accepts an incident payload and returns:
- `report`: copy-ready English support report
- `diagnosticId`: stable incident identifier
- `csv`: per-failure diagnostic rows
- `diagnostics`: redacted JSON-safe incident data

The reporter strips credential-like fields (`authorization`, bearer/token/API-key/cookie/secret/password keys) before returning diagnostics. Never put provider credentials in an incident payload.

Recommended lifecycle: `OPEN -> MONITORING -> RECOVERED`. A future persistence layer should store incidents and provider request telemetry, then automatically open incidents after a bounded retry threshold and mark recovery after consecutive successful checks.

This reporter does not call unlock/decrypt/DRM/premium routes and should only record normal safe playback/provider requests.
