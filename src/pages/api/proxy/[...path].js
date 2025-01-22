import httpProxyMiddleware from 'next-http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  return httpProxyMiddleware(req, res, {
    target: 'https://api.swissmote.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/proxy': '', // remove /api/proxy prefix
    },
  });
} 