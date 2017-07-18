### インストール
```
pip install -r requirements.txt
```

### 実行
ストリーム
```
python -m listen
```
ワーカー
```
celery -A tasks.celery -l INFO worker
```
定期ツイート
```
celery -A tasks.celery -l INFO beat
```
フレーズ候補抽出鯖
```
python -m yahookp
```

### TODO

- [x] TfIdfでゴミ掃除
- [ ] リアルタイムのクラウド表示/ツイート検索用サイト
- [ ] JumanppやMeCabで形態素解析の導入
- [ ] nグラムを候補に挙げる

### ライセンス

wordcloud2.js  
Tag cloud/Wordle presentation on 2D canvas or HTML  
url: https://github.com/timdream/wordcloud2.js  
license : MIT
