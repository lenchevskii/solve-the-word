const { compose
      , chunk 
      }                 = require('lodash/fp')

const ARGS              = process.argv.slice(2)

const hasRoot           = (x)       => Math.sqrt(x.length) % 1 === 0

const isLetterUC        = (x)       => /^[A-Z]+$/.test(x)

const checkARGS         = ([l, w])  => hasRoot(l) && isLetterUC(l) && isLetterUC(w)
                                        ? [l, w]
                                        : console.error('Unapproptiate input.')

const constructMatrix   = ([l, w])  => ([ chunk(Math.sqrt(l.length), [...l]), w ])

const findPath					= ([m, w])	=> m

const timerWrap         = (f, arg)  => { console.time(`Fnc executed in`); f(arg); console.timeEnd(`Fnc executed in`) }

const solveWord         = compose(constructMatrix, checkARGS)

module.export           = { solveWord, ARGS }

												timerWrap(solveWord, ARGS)

												console.log(solveWord(ARGS))

// l - letters
// m - matrix
// w - word
