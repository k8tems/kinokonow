### インストール
```
pip install -r requirements.txt
```

### 実行
ストリーム
```
python -m kinokonow.listen
```
ワーカー
```
celery -A kinokonow.tasks.celery -l INFO worker
```
定期ツイート
```
celery -A kinokonow.tasks.celery -l INFO beat
```
フレーズ候補抽出鯖
```
python -m kinokonow.yahooma
```

### ライセンス

wordcloud2.js  
Tag cloud/Wordle presentation on 2D canvas or HTML  
url: https://github.com/timdream/wordcloud2.js  
license : MIT
