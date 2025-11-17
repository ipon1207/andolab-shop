# サーバーの自動起動 (systemd) について

このドキュメントは、Raspberry Piの起動時に、このアプリケーションのバックエンドサーバーとフロントエンドサーバーを自動的に起動させるための設定と、その運用方法について説明します。

これは、本番環境での安定したアプリケーション運用の心臓部です。

## 概要

このプロジェクトでは、Linuxの標準的なサービス管理システムである **`systemd`** を利用して、サーバープロセスを永続化（デーモン化）しています。

- **バックエンドサーバー (`backend-shop.service`):**
    - Honoで構築されたAPIサーバーです。
    - `npm run build`で生成されたJavaScriptファイル (`dist/index.js`) を、`node`で直接実行します。
    - ポート `3000` でリクエストを待ち受けます。

- **フロントエンドサーバー (`frontend-shop.service`):**
    - Reactで構築され、ビルドされた静的なHTML/CSS/JSファイル群を配信するサーバーです。
    - `serve`パッケージを利用して、`packages/frontend/dist`ディレクトリの内容を配信します。
    - ポート `8080` でリクエストを待ち受けます。

## サービス設定ファイル

これらのサービスの振る舞いは、`/etc/systemd/system/`ディレクトリにある2つの設定ファイルによって定義されています。

1.  `/etc/systemd/system/backend-shop.service`
2.  `/etc/systemd/system/frontend-shop.service`

### 1. バックエンド (`backend-shop.service`) の設定内容

```ini
[Unit]
Description=Andolab Shop Backend Server
# ネットワークが利用可能になってから起動する
After=network.target

[Service]
# 実行ユーザーとグループ
User=andolab
Group=andolab
# コマンドを実行する際の作業ディレクトリ
WorkingDirectory=/home/andolab/andolab-shop

# 'nvm'でインストールしたnode/npmを見つけるための、最も重要な設定
Environment="PATH=/home/andolab/.nvm/versions/node/v24.11.1/bin:/usr/bin:/usr/local/bin"
# アプリケーションを本番モードで実行するための環境変数
Environment=NODE_ENV=production

# 実行するコマンド。npmを介さず、nodeでビルド生成物を直接実行する
ExecStart=/home/andolab/.nvm/versions/node/v24.11.1/bin/node /home/andolab/andolab-shop/packages/backend/dist/index.js

# もしプロセスが何らかの理由で落ちても、10秒後に自動で再起動する
Restart=always
RestartSec=10

[Install]
# OS起動時に自動起動するための設定
WantedBy=multi-user.target
```

### 2. フロントエンド (`frontend-shop.service`) の設定内容

```ini
[Unit]
Description=Andolab Shop Frontend Server
After=network.target
# バックエンドサービスが起動した後に、このサービスを起動する（依存関係）
Wants=backend-shop.service
After=backend-shop.service

[Service]
User=andolab
Group=andolab
# 作業ディレクトリは、配信したいdistフォルダがあるfrontendパッケージ
WorkingDirectory=/home/andolab/andolab-shop/packages/frontend

# バックエンド同様、nvmのnodeを見つけるためのPATH設定
Environment="PATH=/home/andolab/.nvm/versions/node/v24.11.1/bin:/usr/bin:/usr/local/bin"

# 実行コマンド。モノレポルートのnode_modulesにあるserveコマンドをフルパスで指定
ExecStart=/home/andolab/andolab-shop/node_modules/.bin/serve -s dist -l 8080

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

---

## 運用コマンド集

これらのサービスを管理するには、`systemctl`コマンドを使用します。コマンドの実行には`sudo`が必要です。

### 状態の確認

サービスが現在どういう状態か（起動中、停止中、エラーなど）を確認します。

```bash
sudo systemctl status backend-shop.service
sudo systemctl status frontend-shop.service
```

### サービスの起動・停止

手動でサービスを開始したり、停止したりします。

```bash
# 起動
sudo systemctl start backend-shop.service

# 停止
sudo systemctl stop backend-shop.service
```

### サービスの再起動

コードを更新した後など、設定を再読み込みしてサービスを再起動します。

```bash
sudo systemctl restart backend-shop.service
sudo systemctl restart frontend-shop.service
```

### ログの確認

サービスの実行ログ（`console.log`の内容やエラーメッセージ）をリアルタイムで確認します。**デバッグに最も重要なコマンドです。**

```bash
sudo journalctl -u backend-shop.service -f
sudo journalctl -u frontend-shop.service -f
```

### 自動起動の有効化・無効化

Raspberry Piの起動時にサービスを自動で立ち上げるかどうかを設定します。（現在は両方とも有効化されています）

```bash
# 有効化
sudo systemctl enable backend-shop.service

# 無効化
sudo systemctl disable backend-shop.service
```

---

## アプリケーションの更新（デプロイ）手順

Gitリポジトリのコードを更新し、それを本番環境に反映させる際の基本的な流れです。

1.  **最新のコードを取得します**

    ```bash
    # プロジェクトのルートディレクトリで実行
    git pull origin main
    ```

2.  **依存関係を更新します**
    `package.json`に変更があった場合に備え、必ず実行します。

    ```bash
    npm install
    ```

3.  **アプリケーションをビルドします**
    フロントエンドとバックエンドのソースコードを、本番用のJavaScriptファイルに変換します。

    ```bash
    npm run build
    ```

    **注意:** このビルドを忘れると、サーバーを再起動しても古いコードが動き続けることになります。

4.  **サービスを再起動します**
    `systemd`に、新しくビルドされたファイルを読み込ませて、プロセスを再起動させます。
    ```bash
    sudo systemctl restart backend-shop.service
    sudo systemctl restart frontend-shop.service
    ```

以上の手順で、アプリケーションの更新が完了です。
