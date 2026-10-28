# こもれびキャンプ

実在のキャンプ場をモチーフにした、かわいい3Dキャンプゲームです。

## 遊べること

- 日本の海岸線を使った立体地図と、関東・甲信越・静岡の21キャンプ場
- テント・焚き火・食事・就寝を自由な順番で体験（1つでクリア）
- ドーム型・ワンポール型・ロッジ型・コテージの選択
- 体験済みの道具を地図に表示
- 訪問回数・訪問ごとの体験履歴をブラウザに自動保存
- WebGLが使えない場合のCPU描画

## ローカルで起動

Python 3がある環境で、リポジトリのルートから実行してください。

```bash
python -m http.server 8000 --directory dist
```

ブラウザで http://localhost:8000 を開きます。ES Modulesを使うため、HTMLファイルを直接開かずHTTPサーバー経由で起動してください。ビルドやnpmインストールは不要です。

## ファイル

- `dist/index.html`: 画面の構造
- `dist/style.css`: デザイン・レスポンシブ表示
- `dist/app.js`: 3Dシーン・ゲーム・記録管理
- `dist/soft-renderer.js`: CPU描画による互換表示
- `dist/japan-geometry.js`: 日本の海岸線データ
- `dist/vendor/`: 同梱のThree.jsとライセンス
- `.openai/hosting.json`: Sitesのホスティング設定

## データと注意事項

進捗は端末・ブラウザごとのlocalStorageに保存されます。実在のキャンプ場の地形・施設配置・宿泊タイプはゲーム向けの演出を含み、予約や現地案内には使えません。

Three.jsのライセンスは `dist/vendor/THREE-LICENSE.txt` を参照してください。日本の海岸線は、パブリックドメインのNatural Earth 1:50mデータを簡略化しています。

公開サイト: https://komorebi-camp-3d.nttd-fr-5197.chatgpt.site
