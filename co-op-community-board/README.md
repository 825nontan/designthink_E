# Co-op Community Board

大学生協のレジ待ち時間を「退屈な時間」から「楽しい時間」に変えるコミュニティWebアプリ。

![女子大らしい、やさしく明るいコミュニティ](./docs/concept.md)

## 🚀 クイックスタート

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# .env.localファイルを作成（.env.exampleを参考に）
cp .env.example .env.local
```

### 環境変数設定

`.env.local`にFirebaseのプロジェクト情報を設定します：

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 開発サーバー起動

```bash
npm run dev
```

http://localhost:5173 でアプリケーションが起動します。

### ビルド

```bash
npm run build
```

## 📱 アプリケーション構造

### ページ構成

- `/community/:storeId` - 店舗ごとのコミュニティボード
  - `seikyo` - 大学生協 購買
  - `noma` - noma
  - `cafeteria` - 食堂

### 主な機能

#### 1. リアルタイム投稿
- 50文字以内の匿名投稿
- 絵文字対応
- 場所タグ選択
- 自動削除（10分後）

#### 2. リアクション機能
- 👍 のみ利用可能
- リアルタイム更新

#### 3. 統計表示
- 👀 現在閲覧中の人数
- 🌸 今日の利用者数
- 💬 今日の投稿数

#### 4. 混雑ヒートマップ
- 話題の場所をビジュアル化
- リアルタイム更新

#### 5. トレンド表示
- 今日人気のカテゴリ
- リアルタイム集計

## 🎨 デザインシステム

### カラーパレット

| 用途 | 色 | コード |
|-----|-----|-------|
| メイン（エンジ） | ![#8C1D40](https://via.placeholder.com/20/8C1D40/8C1D40) | #8C1D40 |
| アクセント（クリームイエロー） | ![#FFF3B0](https://via.placeholder.com/20/FFF3B0/FFF3B0) | #FFF3B0 |
| サブ（淡いピンク） | ![#FADADD](https://via.placeholder.com/20/FADADD/FADADD) | #FADADD |
| 成功（若葉グリーン） | ![#CFE8A9](https://via.placeholder.com/20/CFE8A9/CFE8A9) | #CFE8A9 |
| テキスト（濃いグレー） | ![#444444](https://via.placeholder.com/20/444444/444444) | #444444 |

### UI要素
- 角丸カード（border-radius: 16-20px）
- 大きめ余白（padding: 16px以上）
- 柔らかい影（box-shadow: 0 2px 8px）
- 丸いボタン（border-radius: 24px）

## 📁 プロジェクト構成

```
co-op-community-board/
├── src/
│   ├── components/          # 再利用可能なコンポーネント
│   │   ├── PostForm.tsx      # 投稿フォーム
│   │   ├── PostCard.tsx      # 単一投稿
│   │   ├── PostList.tsx      # 投稿一覧
│   │   ├── StatsCard.tsx     # 統計カード
│   │   ├── HeatmapSection.tsx # ヒートマップ
│   │   └── TrendSection.tsx   # トレンド表示
│   ├── pages/               # ページコンポーネント
│   │   └── CommunityBoardPage.tsx
│   ├── services/            # ビジネスロジック
│   │   ├── firebase.ts       # Firebase初期化
│   │   ├── authService.ts    # 認証処理
│   │   └── postService.ts    # 投稿管理
│   ├── types/               # TypeScript型定義
│   │   └── index.ts
│   ├── styles/              # グローバルスタイル
│   ├── App.tsx              # ルートコンポーネント
│   ├── main.tsx             # エントリーポイント
│   └── index.css            # グローバルCSS
├── public/                  # 静的ファイル
├── index.html               # HTMLテンプレート
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## 🔧 技術スタック

### フロントエンド
- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - ビルドツール
- **React Router** - ルーティング

### バックエンド
- **Firebase Authentication** - 匿名認証
- **Cloud Firestore** - リアルタイムデータベース
- **Firebase Hosting** - ホスティング

### 開発ツール
- **ESLint** - コード品質チェック
- **Vite Dev Server** - 開発サーバー

## 📚 使用方法

### 投稿の流れ

1. QRコード/NFCタグをスキャン → `/community/:storeId`へアクセス
2. 匿名認証で自動ログイン
3. 投稿フォームで内容を入力
4. 場所タグを選択（オプション）
5. 「投稿する」ボタンをクリック
6. リアルタイムで投稿が一覧に表示

### 投稿の表示期間

- 投稿は **10分** で自動削除
- 古い投稿はアーカイブ機能へ
- リアルタイム掲示板として機能

## 🚀 デプロイ

### Firebase Hostingへデプロイ

```bash
# Firebaseにログイン
firebase login

# デプロイ
firebase deploy
```

## 🔐 セキュリティ

- 匿名認証を使用（ログイン不要）
- UID基盤の利用者追跡（今日の利用者数集計）
- Firestoreセキュリティルール（別途設定）

## 📊 Firestore スキーマ

```
stores/{storeId}/
├── posts/{postId}/
│   ├── content (string, max: 50)
│   ├── emoji (string)
│   ├── location (string, nullable)
│   ├── likes (number)
│   ├── createdAt (timestamp)
│   └── uid (string)
```

## 🎯 今後の拡張予定

- [ ] 生協からのお知らせ
- [ ] 今日のおすすめ商品
- [ ] 期間限定メニュー
- [ ] イベント告知
- [ ] 店舗追加機能
- [ ] 学園祭限定掲示板
- [ ] 季節限定デザイン
- [ ] 投票機能
- [ ] お気に入り投稿
- [ ] 混雑時間帯の統計表示

## 📝 ライセンス

MIT License

## 👥 開発チーム

E班デザイン思考プロジェクト

---

**最終更新**: 2026年6月25日
