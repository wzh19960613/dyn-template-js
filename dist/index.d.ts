export interface DynTemplate<F extends (...args: any) => any = () => any> {
	first: string
	fns: readonly F[]
	strs: readonly string[]
}
export declare function dynTemplate<F extends (...args: any) => any>(strs: TemplateStringsArray, ...exps: any[]): DynTemplate<F>
export declare function closure<F extends (...args: any) => any>(template: DynTemplate<F>): () => string
export declare function dyn(strs: TemplateStringsArray, ...exps: any[]): () => string

export { }
