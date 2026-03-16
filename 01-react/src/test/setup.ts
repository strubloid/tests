import '@testing-library/jest-dom'

export const delay = (ms: number = 2000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
