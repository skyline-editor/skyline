export function insertStrAtIndex(
  parent: string,
  index: number,
  str: string
): string {
  return parent.slice(0, index) + str + parent.slice(index)
}
