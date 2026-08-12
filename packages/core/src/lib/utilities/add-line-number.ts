/* Takes a string like  =>
{
  hello
  world
  this
  is
  good
}
and turn it into string like =>
{
  1 | hello
  2 | world
  3 | this
  4 | is
  5 | good
}
*/

/* Steps */

// "Break a string into pieces" split them based on separator
// "Transform every item in an array"
// "Then transform the new array into desired format array" => .map()
// "Combine an array back into a string" => .join()
// "Then adjust index issues"


export function addLineNumber(content: string) {
  const strToArray = content.split("\n")
  const numberToLineArray = strToArray.map((line, idx) => `${idx + 1} | ${line}`)
  const strWithNumber = numberToLineArray.join("\n")

  return strWithNumber
}
