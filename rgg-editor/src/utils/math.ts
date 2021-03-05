export const parseNumber = (v: number | string) => {
    if (typeof v === 'number') return v
    try {
        const _v = evaluate(v)
        if (!isNaN(_v)) return _v
    } catch {}
    return parseFloat(v)
}

const parens = /\(([0-9+\-*/^ .]+)\)/ // Regex for identifying parenthetical expressions
const exp = /(\d+(?:\.\d+)?) ?\^ ?(\d+(?:\.\d+)?)/ // Regex for identifying exponentials (x ^ y)
const mul = /(\d+(?:\.\d+)?) ?\* ?(\d+(?:\.\d+)?)/ // Regex for identifying multiplication (x * y)
const div = /(\d+(?:\.\d+)?) ?\/ ?(\d+(?:\.\d+)?)/ // Regex for identifying division (x / y)
const add = /(\d+(?:\.\d+)?) ?\+ ?(\d+(?:\.\d+)?)/ // Regex for identifying addition (x + y)
const sub = /(\d+(?:\.\d+)?) ?- ?(\d+(?:\.\d+)?)/ // Regex for identifying subtraction (x - y)

/**
 * Copyright: copied from here: https://stackoverflow.com/a/63105543
 * by @aanrudolph2 https://github.com/aanrudolph2
 *
 * Evaluates a numerical expression as a string and returns a Number
 * Follows standard PEMDAS operation ordering
 * @param {String} expr Numerical expression input
 * @returns {Number} Result of expression
 */
function evaluate(expr: string): number {
    if (isNaN(Number(expr))) {
        if (parens.test(expr)) {
            const newExpr = expr.replace(parens, (_match, subExpr) => String(evaluate(subExpr)))
            return evaluate(newExpr)
        } else if (exp.test(expr)) {
            const newExpr = expr.replace(exp, (_match, base, pow) => String(Math.pow(Number(base), Number(pow))))
            return evaluate(newExpr)
        } else if (mul.test(expr)) {
            const newExpr = expr.replace(mul, (_match, a, b) => String(Number(a) * Number(b)))
            return evaluate(newExpr)
        } else if (div.test(expr)) {
            const newExpr = expr.replace(div, (_match, a, b) => {
                // b can equal either 0 or "0" this is on purpose
                // eslint-disable-next-line eqeqeq
                if (b != 0) return String(Number(a) / Number(b))
                else throw new Error('Division by zero')
            })
            return evaluate(newExpr)
        } else if (add.test(expr)) {
            const newExpr = expr.replace(add, (_match, a: string, b: string) => String(Number(a) + Number(b)))
            return evaluate(newExpr)
        } else if (sub.test(expr)) {
            const newExpr = expr.replace(sub, (_match, a, b) => String(Number(a) - Number(b)))
            return evaluate(newExpr)
        } else {
            return Number(expr)
        }
    }
    return Number(expr)
}