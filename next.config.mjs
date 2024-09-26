/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@mui/x-charts'],
  images: {
    domains: ['crm.studywithbcie.co.uk'], // Add your external image domains here
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3|mpeg|wav)$/,  // Adjust file extensions as needed
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/media/',
          publicPath: '/_next/static/media/',
        },
      },
    });

    return config;
  },

};

export default nextConfig;
