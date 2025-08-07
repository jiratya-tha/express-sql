// Simple JWT decode function (no external dependencies needed for basic decoding)
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export interface DecodedToken {
  id: number;
  email: string;
  username: string;
  created_at: string;
  iat?: number;
  exp?: number;
}

export const getUserFromToken = (token: string): DecodedToken | null => {
  const decoded = decodeToken(token);
  if (decoded && decoded.id && decoded.email && decoded.username && decoded.created_at) {
    return decoded as DecodedToken;
  }
  return null;
}; 