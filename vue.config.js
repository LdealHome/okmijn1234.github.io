const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  lintOnSave: false,
  baseUrl: undefined,
  outputDir: process.env.VUE_APP_OUTPUT_DIR,
  assetsDir: process.env.VUE_APP_ASSETS_DIR,
  indexPath: process.env.VUE_APP_INDEX_PATH,
  runtimeCompiler: false,
  productionSourceMap: false,
  parallel: undefined,
  css: undefined,

  configureWebpack (config) {
    return {
      output: {
        filename: `${process.env.VUE_APP_ASSETS_DIR}/js/[name].${isProduction ? '[contenthash:8].' : ''}js`,
        chunkFilename: `${process.env.VUE_APP_ASSETS_DIR}/js/[name].js?[contenthash:8]`
      },
      plugins: isProduction ? [new BundleAnalyzerPlugin({ analyzerMode: 'static' })] : [],
      optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({ assetNameRegExp: /\.css(\?[a-z0-9]{8})?$/g })]
      }
    }
  },

  chainWebpack (config) {
    // 规则配置
    config.module
      .rule('pug')
      .uses.clear()
      .end()
      .oneOf('vue') // 这条规则应用到 Vue 组件内的 `<template lang="pug">`
      .resourceQuery(/^\?vue/)
      .use('vue')
      .loader('pug-plain-loader')
      .end()
      .end()
      .oneOf('pug') // 这条规则应用到 JavaScript 内的 pug 导入
      .use('pug')
      .loader('raw-loader')
      .end()
      .use('vue')
      .loader('pug-plain-loader')
    // 别名配置
    config.resolve.alias
      .set('@font', resolve('src/assets/font'))
      .set('@icon', resolve('src/assets/icon'))
      .set('@images', resolve('src/assets/images'))
      .set('@reset', resolve('src/common/reset'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@public', resolve('public'))
    // 添加扩展名
    config.resolve.extensions
      .add('.less')
      .add('.pug')
    // 插件修改
    if (isProduction) {
      config.plugin('extract-css')
        .tap(args => {
          args[0].filename = `${process.env.VUE_APP_ASSETS_DIR}/css/[name].[contenthash:8].css`
          args[0].chunkFilename = `${process.env.VUE_APP_ASSETS_DIR}/css/[name].css?[contenthash:8]`
          return args
        })
    }
    // 取消预加载，减小带宽消耗
    config.plugins.delete('prefetch')
    // 这个插件在源码中写死了只优化.css结尾的文件，提取出来的文件是.css?hash没法匹配
    config.plugins.delete('optimize-css')
  },

  pluginOptions: {
    'style-resources-loader': { // 自动导入样式变量
      preProcessor: 'less',
      patterns: [
        resolve('./src/common/reset/import.less')
      ]
    }
  }
}
