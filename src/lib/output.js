exports.showTestStart = (currentUrl, index, urls) => {
  const color = '\u001b[44m\u001b[37m';
  const reset = '\u001b[0m';

  console.log(`${color} 🖥  ${currentUrl} | ${index} / ${urls.length} ${reset}`);
};

exports.showResult = (errorList) => {
  let msg = '';
  if (errorList.length === 0) {
    msg = '✅  🎉🎉🎉Congratulation for passing!!🎉🎉🎉';
  } else {
    msg = '❌  Failed the test...😭';
  }

  console.log('\n' + msg + '\n');
};
