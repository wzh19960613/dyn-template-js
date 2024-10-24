export interface DynTemplate<F extends (...args: any) => any = () => any> {
    first: string
    fns: readonly F[]
    strs: readonly string[]
}

const empty = Object.freeze([])

function _dyn<F extends (...args: any) => any>(_strs: TemplateStringsArray, exps: any[]) {
    const len = exps.length
    if (!len) return { first: _strs[0], fns: empty, strs: empty }
    const fns: F[] = [], strs: string[] = []
    let n = 0
    for (let i = 0; i < len; ++i) {
        strs[n] ? strs[n] += _strs[i] : strs[n] = _strs[i]
        const p = exps[i], ty = typeof p
        if (ty === 'function') { fns[n] = p; n += 1 }
        else if (ty === 'string') strs[n] += p
        else strs[n] += String(p)
    }
    const first = strs.shift()!
    --n
    strs[n] ? strs[n] += _strs[len] : strs[n] = _strs[len]
    Object.freeze(strs)
    Object.freeze(fns)
    return { first, fns, strs } as DynTemplate<F>
}

export function dynTemplate<F extends (...args: any) => any>(
    strs: TemplateStringsArray, ...exps: any[]
) { return _dyn<F>(strs, exps) }

export function closure<F extends (...args: any) => any>(template: DynTemplate<F>) {
    const { first, fns, strs } = template
    return function () { return fns.reduce((r, p, i) => r + p() + strs[i], first) }
}

export function dyn(strs: TemplateStringsArray, ...exps: any[]) { return closure(_dyn(strs, exps)) }