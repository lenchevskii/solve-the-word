const { compose
      , chunk
      , head
      , tail
      , some
      , findIndex
      , map
      , join
      }               = require('lodash/fp')

const ARGS            = process.argv.slice(2)

const N               = Math.sqrt(head(ARGS).length)

// const trace           = (x, y)  => { console.log(x, y); return x}

const isDimension     = (_)       => N % 1 === 0

const isLettersUC     = (x)       => /^[A-Z]+$/.test(x)

const checkARGS       = ([ls, w]) => isDimension() && isLettersUC(ls) && isLettersUC(w)
                                      ? [ls, w]
                                      : console.error('Inappropriate input.')

const constructMatrix = ([ls, w]) => ([chunk(N, [...ls]), w])                       // return [matrix, word]

const getPositionR    = ([
                          [M, l],
                          [m, n]
                        ])        => some((x) => x === l, head(M))
                                      ? [m, findIndex((x) => x === l, head(M))]     // base case return position [m, n]
                                      : getPositionR([[tail(M), l], [m + 1, findIndex((x) => x === l, head(M))]])

const maybePosition   = ([
                          [M, l],
                          [m, n]
												])        => { try { return getPositionR([[M, l], [m, n]]) } catch { console.error('Not all letters are present.')} }

const findPath        = ([M, w])  => [...w].map((l) => maybePosition([[M, l], [0, 0]]))

const timerWrap       = (f, arg)  => { console.time(`Fnc executed in`); f(arg); console.timeEnd(`Fnc executed in`) }

const solveWord       = compose(findPath, constructMatrix, checkARGS)


module.export         = { solveWord, ARGS }

                      console.log(`\nFind ${tail(ARGS)} in ${head(ARGS)}\n`)

                      timerWrap(solveWord, ARGS)

                      console.log('\n', join(' ', map((x) => (`-> [${x}]`), solveWord(ARGS))), '\n')

// x  - some element
// L  - letters
// l  - letter
// M  - matrix
// m  - row
// n  - column
// w  - word
