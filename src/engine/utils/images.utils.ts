
export const getPNGBase64FromBuffer = (buffer: Buffer) => `data:image/png;base64,${buffer.toString('base64')}`;
export const getBufferDataFromPNGBase65 = (base64: string) =>
  Buffer.from(base64.replace('data:image/png;base64,', ''), 'base64');