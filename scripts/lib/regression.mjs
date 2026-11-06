/**
 * Ridge regression, hand-written rather than pulled in as a dependency --
 * the water-balance model has four features and a few thousand rows at
 * most, well inside what a plain normal-equations solve handles, and a
 * library would be one more thing to trust the numerics of for a result
 * this site means to actually explain to a reader eventually.
 *
 * Ridge rather than plain least squares because the training data (see
 * water-model.mjs) will often carry features that move together --
 * rainfall and snowmelt both push the same direction after a storm -- and
 * an unregularized fit can swing to extreme, unstable coefficients when
 * that happens. The penalty trades a little bias for a fit that stays
 * sane; `lambda` is the knob, 0 recovers plain OLS.
 */

/** Mean of each column of a matrix (array of same-length rows). */
function columnMeans(X) {
  const n = X.length
  const p = X[0]?.length ?? 0
  const means = new Array(p).fill(0)
  for (const row of X) {
    for (let j = 0; j < p; j++) means[j] += row[j] / n
  }
  return means
}

const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length

/** Xᵀy for a centered design matrix and target. */
function crossProduct(X, y) {
  const p = X[0]?.length ?? 0
  const result = new Array(p).fill(0)
  for (let row = 0; row < X.length; row++) {
    for (let j = 0; j < p; j++) result[j] += X[row][j] * y[row]
  }
  return result
}

/** XᵀX for a centered design matrix, as a p×p matrix. */
function gramMatrix(X) {
  const p = X[0]?.length ?? 0
  const G = Array.from({ length: p }, () => new Array(p).fill(0))
  for (const row of X) {
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < p; j++) G[i][j] += row[i] * row[j]
    }
  }
  return G
}

/**
 * Solves Ax = b by Gaussian elimination with partial pivoting. `A` is
 * mutated (copy it first if the caller still needs it); throws if `A` is
 * singular, which a ridge penalty above 0 should always prevent for a
 * matrix built from real, non-degenerate features.
 */
function solveLinearSystem(A, b) {
  const n = A.length
  const M = A.map((row, i) => [...row, b[i]])

  for (let col = 0; col < n; col++) {
    let pivotRow = col
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[pivotRow][col])) pivotRow = row
    }
    if (Math.abs(M[pivotRow][col]) < 1e-12) {
      throw new Error("regression: singular matrix -- collinear features, or lambda is 0")
    }
    ;[M[col], M[pivotRow]] = [M[pivotRow], M[col]]

    for (let row = col + 1; row < n; row++) {
      const factor = M[row][col] / M[col][col]
      for (let k = col; k <= n; k++) M[row][k] -= factor * M[col][k]
    }
  }

  const x = new Array(n).fill(0)
  for (let row = n - 1; row >= 0; row--) {
    let sum = M[row][n]
    for (let col = row + 1; col < n; col++) sum -= M[row][col] * x[col]
    x[row] = sum / M[row][row]
  }
  return x
}

/**
 * Fits `y ~ X` by ridge regression. `X` is an array of feature rows (no
 * intercept column -- the intercept is recovered from the column and target
 * means after centering, so it alone is never penalized). Returns the fitted
 * `coefficients` (one per column of `X`, in order), the `intercept`, and
 * `rSquared` against the training data itself (in-sample -- there is no
 * held-out set here, since the point right now is validating the pipeline's
 * plumbing, not the model's accuracy).
 */
export function fitRidgeRegression(X, y, lambda = 1) {
  if (X.length !== y.length) throw new Error("regression: X and y have different row counts")
  if (X.length < 2) throw new Error("regression: need at least two rows to fit anything")

  const p = X[0].length
  const featureMeans = columnMeans(X)
  const yMean = mean(y)

  const Xc = X.map((row) => row.map((v, j) => v - featureMeans[j]))
  const yc = y.map((v) => v - yMean)

  const G = gramMatrix(Xc)
  for (let i = 0; i < p; i++) G[i][i] += lambda

  const coefficients = solveLinearSystem(G, crossProduct(Xc, yc))
  const intercept = yMean - featureMeans.reduce((sum, m, j) => sum + m * coefficients[j], 0)

  const predictions = X.map(
    (row) => intercept + row.reduce((sum, v, j) => sum + v * coefficients[j], 0),
  )
  const residualSumSquares = y.reduce((sum, actual, i) => sum + (actual - predictions[i]) ** 2, 0)
  const totalSumSquares = y.reduce((sum, actual) => sum + (actual - yMean) ** 2, 0)
  const rSquared = totalSumSquares === 0 ? 1 : 1 - residualSumSquares / totalSumSquares

  return { coefficients, intercept, rSquared }
}

/** Applies a fitted model to one row of features. */
export function predict({ coefficients, intercept }, row) {
  return intercept + row.reduce((sum, v, j) => sum + v * coefficients[j], 0)
}
