<?php

require 'vendor/autoload.php';

use Telegram\Bot\Api;
use Telegram\Bot\Exceptions\TelegramSDKException;

$data = [
    'Тип торта' => $_POST['type'] ?? '',
    'Форма' => 'Круглый',
    'Количество человек' => $_POST['person_count'] ?? '',
    'Основа' => $_POST['base'] ?? '',
    'Крем для начинки' => $_POST['inner'] ?? '',
    'Начинка' => $_POST['filling'] ?? '',
    'Имя' => $_POST['name'] ?? '',
    'Телефон' => $_POST['phone'] ?? '',
    'Дата' => $_POST['date'] ?? '',
    'Время' => $_POST['time'] ?? '',
];
$message = "<b>Новый заказ!</b> \n";

foreach ($data as $key => $value) {
    $message .= "\n<b>$key</b>: $value";
}

TelegramWorker::sendMessage($message);

class TelegramWorker
{
    protected const TELEGRAM_TOKEN = '5095937643:AAHPUp0l6RGq2iu3HXWGkyiMq65tnfPzKEE';
    protected const GROUP_ID = '-713501694';

    public static $botInstance;

    public static function bot(): Api
    {
        if (!self::$botInstance) {
            self::$botInstance = new Api(self::TELEGRAM_TOKEN);
        }

        return self::$botInstance;
    }

    public static function sendMessage($message)
    {
        $params = [
            'chat_id' => self::GROUP_ID,
            'parse_mode' => 'html',
            'text' => $message,
        ];

        try {
            self::bot()->sendMessage($params);
        } catch (TelegramSDKException $e) {
        }
    }

    public static function sendPhoto($filePath, $caption = "")
    {
        $input_file = \Telegram\Bot\FileUpload\InputFile::create($filePath);

        $params = [
            'chat_id' => self::GROUP_ID,
            'photo' => $input_file,
            'caption' => $caption,
            'parse_mode' => 'html',
        ];

        try {
            self::bot()->sendPhoto($params);
        } catch (TelegramSDKException $e) {
        }
    }

    public static function sendPhotos($files, $caption)
    {
        $medias = [];

        $response = [
            'chat_id' => self::GROUP_ID,
        ];

        for ($i = 1; $i < 6; $i++) {
            if (empty($files["file-$i"]) || !$files["file-$i"]['name'] || !file_exists($files["file-$i"]['tmp_name'])) {
                continue;
            }

            $file = $files["file-$i"];
            $medias[] = [
                'type' => 'photo',
                'media' => "attach://{$file['name']}",
                'caption' => $caption,
                'parse_mode' => 'html',
            ];

            $response[$file['name']] = new CURLFile($file['tmp_name']);
        }

        $response['media'] = json_encode($medias);

        try {
            self::sendTelegram('sendMediaGroup', $response);
        } catch (Exception $e) {
        }
    }

    public static function sendTelegram($method, $params)
    {
        $ch = curl_init('https://api.telegram.org/bot' . self::TELEGRAM_TOKEN . '/' . $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type:multipart/form-data"]);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        $res = curl_exec($ch);
        curl_close($ch);

        return $res;
    }
}

?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width; initial-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>Конструктор тортов, создать свой торт - takeacake.store: купить торт в Омске, интернет-магазин тортов и
           сладостей</title>
    <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700&amp;subset=cyrillic">
    <link rel="stylesheet" href="../front/assets/css/reset.css%3Fv1.css">
    <link rel="stylesheet" href="../front/assets/css/common.css%3Fv38.css">
    <!-- Yandex.Metrika counter -->
    <script type="text/javascript">
        (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () {
                (m[i].a = m[i].a || []).push(arguments);
            };
            m[i].l = 1 * new Date();
            k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a);
        })
        (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

        ym(86852578, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
        });
    </script>
    <noscript>
        <div><img src="https://mc.yandex.ru/watch/86852578" style="position:absolute; left:-9999px;" alt="" /></div>
    </noscript>
    <!-- /Yandex.Metrika counter -->
</head>
<body class="theme--winter">

<div id="layout">

    <div id="header" class="header">
        <div class="container">

            <a class="logo" href="/">
                <img src="../front/assets/images/logo.png" width="180px" alt="Take a cake"
                     srcset="../front/assets/images/logo.png 2x,
                   ../front/assets/images/logo.png 3x,
                  ../front/assets/images/logo.png 4x">
            </a>
            <div class="header__contacts">
                <div class="share share--color--blue">
                    <div class="share__items">
                        <a class="share__item share__instagram" href="https://www.instagram.com/take_a_cake_omsk/"
                           rel="nofollow" target="_blank" title="Instagram">
                            <svg class="share__icon">
                                <use xlink:href="#instagram"></use>
                            </svg>
                        </a>
                    </div>
                </div>
                <div class="phone">
                    <div class="phone__number">
                        <a class="link phone-link" href="tel:+79263713629" rel="nofollow">+7 913 664-19-02</a>
                    </div>
                    <div class="phone__adds">
                        <div class="phone__time">с 8:00 до 22:00</div>
                        <a class="whatsapp" href="https://wa.me/79136641902" rel="nofollow">WhatsApp</a>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <main id="content" class="content">
        <div class="section">
            <div class="container">

                <div class="designer-top">

                    <div class="designer-top__caption">Спасибо за заказ, скоро с Вами свяжется наш менеджер.</div>

                    <div class="designer-top__ctrls">
                        <a class="btn" href="/">Назад</a>
                    </div>

                </div>

            </div>
        </div>
    </main>
</body>
</html>

