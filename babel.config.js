module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.ts',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@src': './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants',
          '@hooks': './src/hooks',
          '@modules': './src/modules',
          '@pages': './src/pages',
          '@states': './src/states',
        },
      },
    ],
  ],
};
