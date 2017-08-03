import json
import requests


def extract_phrases_from_ma_server(tweet, host, port):
    resp = requests.get('http://%s:%d?tweet=%s' % (host, port, tweet))
    return json.loads(resp.content.decode('utf-8'))
