import {JaegerExporter} from '@opentelemetry/exporter-jaeger';
import {config} from 'dotenv';
import {Resource} from '@opentelemetry/resources';
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions';
import {NodeSDK} from '@opentelemetry/sdk-node';
import {getNodeAutoInstrumentations} from '@opentelemetry/auto-instrumentations-node';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-grpc';
import {diag, DiagConsoleLogger, DiagLogLevel} from '@opentelemetry/api';
import {NodeTracerProvider} from '@opentelemetry/sdk-trace-node';
import {
	ConsoleSpanExporter,
	SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import {Span} from '@opentelemetry/api';

config();

interface TraceConfigOptions {
	version?: string;
	serviceName: string;
	otlpEndpoint: string;
	exporter?: JaegerExporter | OTLPTraceExporter | any;
	console?: {
		log: boolean;
	};
}

const isDebug = () => process.env.DEBUG_MODE === 'true';

const setResource = (opts: TraceConfigOptions) => {
	return Resource.default().merge(
		new Resource({
			[SemanticResourceAttributes.SERVICE_NAME]: opts.serviceName,
			[SemanticResourceAttributes.SERVICE_VERSION]: opts.version,
		}),
	);
};

const setProvider = (resource: Resource) =>
	new NodeTracerProvider({resource});

const setExporter = (opts: TraceConfigOptions) =>
	new opts.exporter({url: opts.otlpEndpoint});

if (isDebug()) diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);


export const start = (configs: TraceConfigOptions) => {
	const provider = setProvider(setResource(configs));
	const exporter = setExporter(configs);
	const showLogConsole = configs?.console?.log || false;

	if (showLogConsole)
		provider.addSpanProcessor(
			new SimpleSpanProcessor(new ConsoleSpanExporter()),
		);

	provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

	const sdk = new NodeSDK({
		traceExporter: exporter,
		instrumentations: [getNodeAutoInstrumentations()],
		autoDetectResources: true,
	});

	provider.register();

	process.on('SIGTERM', () => {
		sdk
			.shutdown()
			.then(() => console.log('[Opentelemetry] - Tracing terminated'))
			.catch((error) => console.log('Error terminating tracing', error))
			.finally(() => process.exit(0));
	});

	return sdk
		.start()
		.then(() => console.log('[Opentelemetry] - Tracing initialized'))
		.catch((error) => console.log('Error initializing tracing', error));
};
