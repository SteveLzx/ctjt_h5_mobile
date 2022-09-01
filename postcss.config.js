const px2rem = require('postcss-px2rem-exclude');

module.exports = ({ file }) => {
  let rootValue;
  if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
    rootValue = 50
  } else {
    rootValue = 100
  }
  return {
    plugins: [
      px2rem({
        remUnit: rootValue
      })
    ]
  }
}