import unittest
from unittest import mock
import process


class TestRemoveUrl(unittest.TestCase):
    def test(self):
        expected = 'foo foo'
        self.assertEqual(expected, process.remove_url('foo https://t.co/bar foo'))

    def test_eol(self):
        expected = 'foo '
        self.assertEqual(expected, process.remove_url('foo https://t.co/bar'))

    def test_greed(self):
        expected = 'foo '
        # `foo` will also be replaced if the regex engine is greedy
        self.assertEqual(expected, process.remove_url('https://t.co/bar foo '))


class TestRemoveMention(unittest.TestCase):
    def test(self):
        expected = 'foo foo'
        self.assertEqual(expected, process.remove_mention('foo @bar foo'))

    def test_eol(self):
        expected = 'foo '
        self.assertEqual(expected, process.remove_mention('foo @bar'))

    def test_greed(self):
        expected = 'foo '
        self.assertEqual(expected, process.remove_mention('@bar foo '))


class TestRemoveRtBoilerplate(unittest.TestCase):
    def test(self):
        expected = 'foo'
        self.assertEqual(expected, process.remove_rt_boilerplate('RT @bar: foo'))


class TestYahooApi(unittest.TestCase):
    def setUp(self):
        self.session = mock.MagicMock()
        content = '''{"bar": 60, "baz": 40}'''
        self.session.get.return_value = mock.MagicMock(content=content)
        api = process.YahooApi('foo', self.session)
        self.result = api.extract_phrases('bar baz')

    def test_url_called(self):
        url = 'https://jlp.yahooapis.jp/KeyphraseService/V1/extract?' \
              'appid=foo&output=json&sentence=bar baz'
        self.session.get.assert_called_once_with(url)

    def test_return_nouns(self):
        self.assertEqual(['bar', 'baz'], self.result)


if __name__ == '__main__':
    unittest.main()
