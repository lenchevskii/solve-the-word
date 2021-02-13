const { findIndex
      , compose
      , chunk
      , isNil
      , head
      , tail
      , some
      , join
      , map
      }               = require('lodash/fp')

const ARGS            = process.argv.slice(2)

const N               = Math.sqrt(head(ARGS).length)

// const trace           = (x, y)    => { console.log(x, y); return x }                       // trace helper

// const TCO             = (f, argv) => f(argv)                                               // tail call optimization

// const maybe           = (f, arg)    => { try { return (f(arg)) } catch { return undefined } }

const isDimension     = (_)       => N % 1 === 0

const isLettersUC     = (x)       => /^[A-Z]+$/.test(x)

const checkARGS       = ([ls, w]) => isDimension() && isLettersUC(ls) && isLettersUC(w)
                                      ? [ls, w]
                                      : console.error('Inappropriate input.')

const constructMatrix = ([ls, w]) => ([chunk(N, [...ls]), w])                                 // return [matrix, word]

const nGetPositionR   = ([
                          [r, l],
                          [_, n]
                        ])        => head(r) === l
                                      ? n
                                      : nGetPositionR([[tail(r), l], [_, n + 1]])

const mnGetPositionR1  = ([                                                                   // one recursion algorithm
                          [M, l],
                          [m, n]
                         ])       => some((x) => x === l, head(M))
                                      ? [m, findIndex((x) => x === l, head(M))]               // base case returns position [m, n]
                                      : mnGetPositionR1([[tail(M), l], [m + 1, n]])

const mnGetPositionR2  = ([                                                                   // two recursions alrorithm
                          [M, l],
                          [m, n]
                         ])       => some((x) => x === l, head(M))
                                      ? [m, nGetPositionR([[head(M), l], [m, n]])]            // base case returns n recursively
                                      : mnGetPositionR2([[tail(M), l], [m + 1, n]])

// const mnGetPositionR2  = ([
//                           [M, l],
//                           [m, n]
//                          ])       => {
//                                        const nMaybe = maybe(nGetPositionR, [[head(M), l], [m, n]])

//                                        return isNil(nMaybe)                                 // recursive case 25 times slower then some()
//                                          ? mnGetPositionR2([[tail(M), l], [m + 1, n]])
//                                          : [m, nMaybe]
//                                      }

const maybePosition   = ([
                          [M, l],
                          [m, n]
                        ])        => { try { return mnGetPositionR2([[M, l], [m, n]]) } catch { console.error('Not all letters are present.')} }

const findPath        = ([M, w])  => [...w].map((l) => maybePosition([[M, l], [0, 0]]))

const timerWrap       = (f, arg)  => { console.time(`Fnc executed in`); f(arg); console.timeEnd(`Fnc executed in`) }

const solveWord       = compose(findPath, constructMatrix, checkARGS)


module.export         = { solveWord, ARGS }

                      console.log(`\nFind ${tail(ARGS)} in ${head(ARGS)}\n`)

                      timerWrap(solveWord, ARGS)

                      console.log('\n', join(' ', map((x) => (`-> [${x}]`), solveWord(ARGS))), '\n')

// x  - some element
// ls - letters
// l  - letter
// M  - matrix
// n  - column
// m  - row
// w  - word
