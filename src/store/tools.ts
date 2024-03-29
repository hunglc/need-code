import { ProblemsObject, ReviewModel } from './interfaces'

export type Order = 'asc' | 'desc'
export const totalProblems = 2436

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string | Date },
  b: { [key in Key]: number | string | Date },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

/**
 * Get string format of current date
 * @returns str
 */
export const getCurrentDateString = () => {
  const date = new Date()
  return date.toLocaleDateString("en-US",
  {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}

export const pickProblem = (data: ProblemsObject, reviewEnabled?: boolean, review?: ReviewModel) => {
  if (reviewEnabled && review) {
    const ids = Object.keys(review)
    const pick = Math.round((ids.length - 1) * Math.random())

    // return problem id
    return parseInt(ids[pick])
  }

  // random pick from all problems
  return Math.round(totalProblems * Math.random())
}
