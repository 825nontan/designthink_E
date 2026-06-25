# Firebase セットアップガイド

## 1. Firebaseプロジェクトの作成

### 手順

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを作成」をクリック
3. プロジェクト名を入力（例：`co-op-community-board`）
4. Google分析を有効化（オプション）
5. プロジェクトを作成

## 2. Webアプリの登録

1. Firebase Consoleでプロジェクトを開く
2. 「プロジェクト設定」→「アプリを追加」
3. Webを選択（`</>`アイコン）
4. アプリのニックネーム を入力
5. 「アプリを登録」をクリック

## 3. 設定情報のコピー

登録後、以下の情報が表示されます：

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};
```

## 4. 環境変数の設定

`.env.local`ファイルを作成して、以下の情報を設定：

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef1234567890
```

## 5. Authentication の設定

### 匿名認証の有効化

1. Firebase Console で「Authentication」を選択
2. 「Sign-in method」タブを開く
3. 「Anonymous」を探す
4. 有効化するをクリック

## 6. Firestore Database の作成

### データベースの初期化

1. Firebase Console で「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. ロケーション選択（例：`asia-northeast1`）
4. セキュリティルールを設定

### セキュリティルール

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 店舗ごとの投稿コレクション
    match /stores/{storeId}/posts/{postId} {
      // 読み取り：認証ユーザーのみ
      allow read: if request.auth != null;
      
      // 書き込み：認証ユーザーのみ
      allow create: if request.auth != null && 
                       request.resource.data.content.size() <= 50 &&
                       request.resource.data.uid == request.auth.uid;
      
      // 更新：いいねカウント（自分の投稿のみ更新可）
      allow update: if request.auth != null &&
                       resource.data.uid == request.auth.uid;
      
      // 削除：禁止
      allow delete: if false;
    }
  }
}
```

## 7. Firebase Hosting の設定

### デプロイ準備

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを初期化
firebase init hosting
```

### デプロイ

```bash
# ビルド
npm run build

# デプロイ
firebase deploy
```

## 8. QRコード/NFCタグの生成

各店舗のURLをQRコード化：

- `/community/seikyo` → QRコード生成
- `/community/noma` → QRコード生成
- `/community/cafeteria` → QRコード生成

**推奨ツール**: [QR Code Generator](https://qr-code-generator.com/)

## トラブルシューティング

### 認証エラー

- `.env.local`の環境変数を確認
- Firebaseプロジェクトの管理画面で認証が有効になっているか確認

### Firestoreのアクセス拒否

- セキュリティルールが正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### デプロイエラー

```bash
# キャッシュをクリア
firebase clear

# 再度デプロイ
firebase deploy --force
```

---

**関連リンク**:
- [Firebase ドキュメント](https://firebase.google.com/docs)
- [Firestore セキュリティルール](https://firebase.google.com/docs/firestore/security/start)
- [Firebase CLI リファレンス](https://firebase.google.com/docs/cli)
