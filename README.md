

# Opentelemetry Tracing 
## Description
Support add tracing in NodeJS project

## Installation

```bash
$ npm install opentelemetry-tracing
or 
$ yarn add opentelemetry-tracing
```

## Inject plugin

```typescript
// import lib
import * as tracer from 'opentelemetry-tracing';

// Inject current project
await tracer.start({
	serviceName: "<service_name>",
	otlpEndpoint: "<domain_otlp | domain_jagger | .... >",
	version: "<version_tracing>",
	exporter: "<exporter>",
});
```
#### Note:
You can view list exporter has supported
https://opentelemetry.io/docs/instrumentation/js/exporters

[//]: # ()
[//]: # (## Add tracing)

[//]: # ()
[//]: # ()
[//]: # (```typescript)

[//]: # ()
[//]: # (import { TraceService } from 'opentelemetry-tracing';)

[//]: # ()
[//]: # (const traceService = new TraceService&#40;&#41;;)

[//]: # ()
[//]: # ()
[//]: # (// In function need adding trace)

[//]: # ()
[//]: # (const trace = traceService.startSpan&#40;'<span_name>'&#41;;)

[//]: # ()
[//]: # (// code logic)

[//]: # ()
[//]: # (trace.end&#40;&#41;;)

[//]: # ()
[//]: # ()
[//]: # (```)

## License

Nest is [MIT licensed](LICENSE).
