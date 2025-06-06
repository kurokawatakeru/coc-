# ベースイメージとして軽量なNginxを使用します
# これにより、すぐに使える効率的なWebサーバーが提供されます。
FROM nginx:1.27.0-alpine-slim

# READMEには、PDF/印刷機能のためにキャラクターシートの画像が必要であると記載されています。
# 必要なすべてのフロントエンド資産をNginxのWebルートディレクトリにコピーします。
# これには、HTML、CSS、JavaScript、および必須のPNG画像が含まれます。
# プロジェクトからコピーするファイル:
# - index.html
# - styles.css
# - script.js
# - character-sheet.png (README.mdで言及)
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY character-sheet.png /usr/share/nginx/html/

# コンテナ内部のNginx Webサーバー用にポート80を公開します。
# Cloud Runはこのポートに自動的に外部からアクセス可能なポートをマッピングします。
EXPOSE 80

# nginxイメージのデフォルトコマンドは `nginx -g 'daemon off;'` です。
# このコマンドがサーバーを起動するため、ここで上書きする必要はありません。
# CMD ["nginx", "-g", "daemon off;"]