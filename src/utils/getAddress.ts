export const getUserIpAddress = (request): string | null => {
  const headers = request.headers;
  if (!headers) return null;
  const ipAddress = headers['x-forwarded-for'];
  if (!ipAddress) return null;
  return ipAddress;
};
