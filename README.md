# 将棋基礎練習（しょうぎ れんしゅう）

子供から大人まで、将棋の基礎を楽しく学べるWebゲームです。PC・タブレット・スマートフォンに対応しています。

## 機能

### 駒の動き
- 全8種類の駒（王将・飛車・角行・金将・銀将・桂馬・香車・歩兵）の動きを学べます
- 各駒の成り駒の動きも同時に学習できます
- 学習後にはテストモードで理解度を確認できます

### 詰将棋
- 1手詰め〜3手詰めの問題を用意
- 制限手数内に詰められなかった場合はやり直し可能
- クリア状況はローカルストレージに保存

### オプション
- SE（効果音）のON/OFFと音量設定（SE実装はプレースホルダー）
- 「お子様向け」モード：全ての文字をひらがなに変換
- 設定はローカルストレージに保存され、次回起動時に引き継がれます

## 開発方法

### 必要環境

- Node.js 18以上
- npm

### セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd learning-syogi

# 依存パッケージをインストール
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

### ビルド

```bash
npm run build
```

`dist/` ディレクトリにビルド成果物が出力されます。

### ビルドプレビュー

```bash
npm run preview
```

## Google Cloud Storage へのデプロイ手順

### 前提条件

- Google Cloud アカウントとプロジェクトが作成済み
- `gcloud` CLI がインストール・認証済み
- 課金が有効化済み

### 手順

#### 1. Cloud Storage バケットの作成

```bash
# プロジェクトIDを設定
gcloud config set project YOUR_PROJECT_ID

# バケットを作成（リージョンは適宜変更）
gsutil mb -l asia-northeast1 gs://YOUR_BUCKET_NAME
```

#### 2. バケットを公開設定にする

```bash
# 全ユーザーに読み取り権限を付与
gsutil iam ch allUsers:objectViewer gs://YOUR_BUCKET_NAME
```

#### 3. 静的ウェブサイトとして設定

```bash
# メインページとエラーページを設定
gsutil web set -m index.html -e index.html gs://YOUR_BUCKET_NAME
```

#### 4. ビルド & アップロード

```bash
# ビルド
npm run build

# dist/ の中身をバケットにアップロード
gsutil -m rsync -r -d dist/ gs://YOUR_BUCKET_NAME
```

#### 5. アクセス確認

以下のURLでアクセスできます：

```
https://storage.googleapis.com/YOUR_BUCKET_NAME/index.html
```

### カスタムドメインを使用する場合（任意）

1. Cloud Load Balancing を設定
2. SSL証明書を取得（Google マネージド証明書が便利）
3. DNSレコードを設定

詳細は [Google Cloud の公式ドキュメント](https://cloud.google.com/storage/docs/hosting-static-website) を参照してください。

### 更新時のデプロイ

```bash
# ビルドして再アップロード
npm run build
gsutil -m rsync -r -d dist/ gs://YOUR_BUCKET_NAME
```

## ビルドツールなしでのデプロイ（簡易版）

Viteを使わず、静的ファイルとしてそのままデプロイすることも可能です：

```bash
# リポジトリのルートディレクトリをそのままアップロード
gsutil -m rsync -r -d \
  -x 'node_modules/|\.git/|\.gitignore|package.*|vite.config.js|README.md' \
  ./ gs://YOUR_BUCKET_NAME
```

この場合、`index.html` を直接ブラウザで開いても動作します（ES Modules対応ブラウザが必要）。

## 技術スタック

- Vanilla JavaScript（ES Modules）
- HTML5 / CSS3
- Vite（開発サーバー・ビルド）
- LocalStorage（設定・進捗保存）

## プロジェクト構成

```
learning-syogi/
├── index.html          # エントリーポイント
├── css/
│   └── style.css       # スタイルシート
├── js/
│   ├── main.js         # メインエントリー・ルーター
│   ├── board.js        # 将棋盤の描画
│   ├── pieces.js       # 駒の定義・動きロジック
│   ├── puzzles.js      # 詰将棋の問題定義
│   ├── storage.js      # LocalStorage管理
│   ├── i18n.js         # テキスト管理（漢字/ひらがな切替）
│   └── screens/
│       ├── home.js       # ホーム画面
│       ├── pieceMenu.js  # 駒の動き選択画面
│       ├── pieceLearn.js # 駒の学習・テスト画面
│       ├── tsumeMenu.js  # 詰将棋メニュー画面
│       ├── tsumePlay.js  # 詰将棋プレイ画面
│       └── options.js    # オプション画面
├── package.json
├── vite.config.js
└── README.md
```
