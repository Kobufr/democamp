# 実在商品と自分の持ち物

マイページの「装備」にはテント・タープ・ランタン・チェア・クーラーの各領域を続けて表示します。上部のカテゴリボタンは該当領域へスクロールするショートカットです。「車」は専用タブです。所有する商品は全件インラインで並び、選択画面を開く必要はありません。

- **商品を探す**: メーカー名・商品名で検索し、「持ち物に追加」。日本語のメーカー名にも対応。
- **自分の持ち物**: 各カテゴリに全商品を並べて表示。画像を押す操作は3Dの展示・カメラだけを変更します。カテゴリごとの「持っていく」を1点だけチェックします。未選択・削除時は先頭の商品を選択します。
- **自分で登録**: カテゴリと商品名が必須。メーカー、メモ、HTTPSの商品URL、写真は任意。
- 自分で登録した商品の編集・削除に対応。一覧上で編集・削除ができ、削除直後は「元に戻す」で復元できます。
- 3Dの形と色を調整でき、庭に反映。新しいキャンプには「持っていく」の選択を引き継ぎ、訪問時の商品名・IDを記録します。進行中・過去の訪問には後からの変更を反映しません。体験メニューのテント・タープ・車は、その訪問の装備を直接使います。装備メニューや商品選択画面は表示しません。

## データと保存

共通商品は `public/camp/gear-catalog.js` の `GEAR_CATALOG`。
装備別の形・色は `gearCollection.appearances` に保存し、共通の商品情報は変更しません。カードの画像・名前から詳細ウィンドウを開き、説明と色ボタンを表示します。色は各商品に保存します。持っていく選択は画像と独立した専用行です。メニュー画像、ガレージと新規キャンプは同じ保存値を使用します。
利用者のデータは `profile.gearCollection` に持ち物・選択中ID・表示色として保存し、既存のアカウント保存を使用します。個人登録を共通一覧へ追加する仕組みはありません。
写真はブラウザ内で長辺160px・12KB以下のJPEGに縮小し、個人プロフィール内に保存。外部画像URLからの読み込みは行いません。各カテゴリは架空の基本装備を含め最大4点。既存の4点超の持ち物は保持し、追加を止めます。カテゴリを移す編集にも4点制限を適用します。訪問記録には商品名・メーカー・モデル識別子・色だけを保存し、写真を複製しません。
初期状態では各カテゴリに架空の基本装備を1点所有し、選択済みにします。既存のプロフィールは持ち物と選択を維持し、空のカテゴリのみ基本装備を補います。従来の形・色も維持します。

## 3D表示

`gear-models.js` がテントの前室・張り綱・ペグ、タープの縁・張り綱、チェアの布座面・フレーム、ランタンのグローブ・ハンドル、クーラーのラッチ・ハンドルを作ります。車は `camp-vehicle.js` にグリル・ミラー・ハブ等を追加し、ジムニーの近似モデルは丸形ライトを備えます。
自作の近似モデル・イラストであり、公式3Dモデルや寸法精度のある設営シミュレーターではありません。メーカーの画像やロゴは転載していません。価格・在庫・アフィリエイトリンクは含みません。

## 共通商品の情報源（2026-11-05確認）

- SUZUKI ジムニー シエラ: https://www.suzuki.co.jp/car/jimny_sierra/
- snow peak アメニティドームM: https://ec.snowpeak.co.jp/item/SNP0118A0266
- snow peak HDタープ“シールド”・ヘキサ（L）: https://ec.snowpeak.co.jp/item/SNP0118A0547
- snow peak ほおずき ゆき: https://ec.snowpeak.co.jp/item/SNP0115A0069
- Helinox Chair One: https://helinox.tokyo/products/chair-one-black
- Coleman 54QT スチールベルトクーラー: https://ec.coleman.co.jp/ext/pickup_54qt_steelbeltedcooler.html

商品追加時は安定した一意のID、カテゴリ、表示形状、配色、メーカーの商品URLを設定します。記録済みの訪問が参照する `design` は再利用しません。

## 商品別表示の拡充

共通商品は各カテゴリ3点、合計18点。追加商品の情報源:

- TOYOTA ハイエース バン: https://toyota.jp/hiacevan/
- MITSUBISHI デリカD:5: https://www.mitsubishi-motors.com/jp/newsroom/newsrelease/2026/20260109_1.html
- Coleman ツーリングドーム/LX: https://www.coleman.co.jp/customersupport/howtomovie/2000038142/
- tent-Mark DESIGNS サーカスTC DX+: https://www.tent-mark.com/products/circus_tc_dx_sand_color/
- DOD いつかのタープ: https://www.dod.camp/product/tt5_631_tn/
- snow peak レクタ(M): https://www.snowpeak.com/products/recta-tarp-m
- Coleman ワンマントルランタン: https://www.coleman.co.jp/customersupport/howtomovie/2164001-2169494/
- 5050WORKSHOP MINIMALight: https://5050workshop.com/products/minimalight
- snow peak ローチェア30: https://ec.snowpeak.co.jp/item/SNP0116A0238
- Coleman レイチェア: https://partscatalog.special-coleman.com/catalog/detail/1182
- YETI Tundra 45: https://www.yeti.com/coolers/hard-coolers/tundra/tundra-45.html
- snow peak ソフトクーラー18: https://www.snowpeak.com/collections/under-100/products/soft-cooler-18-fp-118

商品ごとの `design` で3Dの幾何形状と紹介イラストを変えています。新旧の訪問記録は `gearSnapshot` のID、または既存の `design` を使って選択中の商品を識別します。

## 持ち物一覧と持っていく装備

マイページには商品カードを並列表示します。カタログ用の別画面は商品追加・個人情報編集用です。各カテゴリでラジオボタンを1つだけ選びます。
庭は手前から人、小物、タープ、テントを配置し、右側に車と専用駐車場を配置します。白い展示台は設けず、持っていく商品に淡い敷石を表示します。オブジェクトをタップすると注目し、空いた場所をタップするとズームと回転角を維持して中央へフォーカスを戻します。メニューのプレビューは庭と共通のモデル生成処理で描画します。画像を押す操作は対象へカメラを寄せるだけで、展示の差し替えや装備変更はしません。
キャンプ開始時に選択中の商品・形・色を訪問へ複製し、体験メニューではそのまま使用します。
