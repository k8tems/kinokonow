import csv
from twython import TwythonStreamer
import settings
import tasks
import database


class Streamer(TwythonStreamer):
    def on_error(self, status_code, data):
        print(status_code)
        self.disconnect()


def get_streamer():
    return Streamer(*settings.get_twython_settings())


def get_followers():
    with open('follow.txt') as f:
        return [user_id for _, user_id, _ in csv.reader(f)]


if __name__ == '__main__':
    users_to_follow = get_followers()
    print('following %d users' % len(users_to_follow))

    def on_success(data):
        if 'text' in data:
            print(data['user']['screen_name'], ':', data['text'], '\n')
            database.save_tweet(data)
            tasks.create_noun_extraction_task(data['text']).delay()

    stream = get_streamer()
    stream.on_success = on_success
    stream.statuses.filter(follow=','.join(users_to_follow))
