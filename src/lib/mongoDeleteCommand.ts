
export function mongoDeleteCommand(field: string, index: number) {
  return {
    [field]: {
      $concatArrays: [
        {
          $slice: [`$${field}`, index],
        },
        {
          $slice: [
            `$${field}`,
            {
              $add: [1, index],
            },
            {
              $size: `$${field}`,
            },
          ],
        },
      ],
    },
  }
}
