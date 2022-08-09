
export const getBufferDataFromUrl = async (url: string): Promise<Buffer> => {
  const response = await fetch(url, { headers: { 'Content-Type': 'arraybuffer' } })
  
  const responseData = await (await response.blob()).arrayBuffer();
  return Buffer.from(responseData);
}