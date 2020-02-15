const puppeteer = require('puppeteer');
const papa = require('papaparse');
const assert = require('assert');
const fs = require('fs');

const root = '../../'
const { showTestStart, showResult  } = require(root + 'lib/output');

// メイン処理
(async () => {
  console.time('Processing time');

  // テスト対象のサイト
  const domain = 'https://www.google.com';

  // テスト対象のデータ ※ Listを直接コードに書く、CSVから読み込む etc...
  file = fs.readFileSync(root + 'data/title.test.csv', 'utf8')
  dataList = papa.parse(file, {
    header: true,
    skipEmptyLines: true
  }).data;

  // カウンタ初期化
  let count = 0;
  // エラー一覧
  let errorList = [];

  // ブラウザ起動
  const browser = await puppeteer.launch();
  for (const data of dataList) {
    count += 1;

    // アクセス先のURLを生成
    const url = domain + data.path;

    // 進捗を表示
    showTestStart(url, count, dataList);

    // ページ生成
    const page = await browser.newPage();

    // JSやCSSの読み込みを無視
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      if (url === interceptedRequest.url()) {
        interceptedRequest.continue();
      } else {
        interceptedRequest.abort();
      }
    });

    // テスト対象のURLにアクセス（返り値にresponseが返る）
    await page.goto(url);

    // ページタイトル取得
    const title = await page.title();

    try {
      // 予期された結果と比較
      assert.equal(title, data.title);
      console.log('✅  ' + 'Expected result');
    } catch (err) {
      console.log('❌  ' + 'Unexpected result');
      console.log(err.message);

      errorList.push(err.message);
    }
    console.log('\n');

    // ページ閉じる
    await page.close();
  }

  // ブラウザ閉じる
  await browser.close()

  showResult(errorList);
  console.timeEnd('Processing time');
})();
