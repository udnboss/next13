/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, //helps in dev they say
  experimental:{
    appDir: true,
    // concurrentFeatures: true,
    // serverComponents: true,
  },
  headers: async () => {
    return [
      {
        source: '/api/items/:id',
        headers: [
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" }
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: '**',
            port: '',
            pathname: '**',
        },
    ],
},
}

module.exports = nextConfig
