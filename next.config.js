/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.176.219.170', '192.168.1.3', '192.168.1.4', '192.168.1.2', 'localhost'],
  // Explicitly define app directory
  distDir: '.next',
}

module.exports = nextConfig
