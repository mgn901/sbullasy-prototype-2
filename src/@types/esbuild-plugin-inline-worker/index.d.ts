declare module '*.worker.ts' {
	export default (() => new Worker());
}
