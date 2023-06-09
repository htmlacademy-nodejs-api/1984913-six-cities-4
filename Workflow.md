# Как работать над проектом

## Окружение

Для удобства работы над проектом используются инструменты из **Node.js** и **npm**. Все необходимые настройки произведены. Убедитесь, что на рабочем компьютере установлен актуальный LTS релиз Node.js**. Актуальная версия **Node.js\*\* указана в файле `package.json` в поле `node`. Затем, в терминале, перейдите в директорию с проектом и _единожды_ запустите команду:

```bash
npm install
```

Команда запустит процесс установки зависимостей проекта из **npm**.

### Сценарии

В `package.json` предопределено несколько сценариев.

#### Скомпилировать проект

```bash
npm run compile
```

Создаст директорию `dist` и скомпилирует проект.

#### Удалить скомпилированный проект

```bash
npm run clean
```

Удаляет директорию `dist`. Используется перед компиляцией.

#### Собрать проект

```bash
npm run build
```

Выполняет сборку проекта: удаляет ранее скомпилированный проект и компилирует заново.

#### Проверить линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

Линтер проверяет файлы только внутри директории `src`.

**Обратите внимание**, при запуске данной команды, ошибки выводятся в терминал.

#### Запустить ts-модуль без компиляции

```bash
npm run ts -- <Путь к модулю с ts-кодом>
```

Пакет `ts-node` позволяет выполнить TS-код в Node.js без предварительной компиляции. Используется только на этапе разработки.

#### Запустить JSON-server с моковыми данными

Запускает тестовый сервер на порту 3123. После выполнения команды данные доступны на http://localhost:3123/api.

```bash
npm run mock:server
```

#### Запустить проект

```bash
npm start
```

В процессе запуска проекта будет выполнен процесс «Сборки проекта» и запуска результирующего кода.

## Структура проекта

### Директория `src`

Исходный код проекта: компоненты, модули и так далее. Структура директории `src` может быть произвольной.

#### Директория `cli-comand`

Запустить CLI

```bash
npm run ts ./src/main.cli.ts
```

CLI поддерживает обработку аргументов:

`--version`

Выводит информацию о версии приложения. Информация о версии считывается из package.json. Пример вывода: 4.0.0.

```bash
npm run ts ./src/main.cli.ts -- --version
```

`--help`

Выводит список и описание всех поддерживаемых аргументов.

> Является командой по умолчанию, если не передан аргумент при запуске CLI.

```bash
npm run ts ./src/main.cli.ts -- --help
```

`--generate <n> <filepath> <url>`

Создаёт файл в формате tsv с тестовыми данными.

```bash
npm run ts ./src/main.cli.ts -- --generate 10 ./mocks/test-data.tsv http://localhost:3123/api
```

> Перед запуском команды необходимо запустить сервер с моковыми данными

- Параметр `n` задаёт количество генерируемых предложений.

- Параметр `filepath` указывает путь для сохранения файла с предложениями.

- Параметр `<url>` задаёт адрес сервера, с которого необходимо взять данные. Каждая строка в файле tsv содержит всю необходимую информацию для создания одного предложения по аренде.

`--import <filepath> <DB_USER> <DB_PASSWORD> <DB_HOST> <DB_NAME> <SALT>`

Импортирует в базу данных информацию из tsv-файла.

```bash
npm run ts ./src/main.cli.ts -- --import ./mocks/mock-data.tsv admin test localhost six-cities text
```

- Параметр `filepath` указывает путь для сохранения файла с предложениями.

- Параметры `<DB_USER>` `<DB_PASSWORD>` `<DB_HOST>` `<DB_NAME>` `<SALT>` определяют данные необходимые для подключения у базе данных. Описание см. "Переменные окружения".
  > Пример этих параметров предусмотрен в `.env-example`

### Файл `Readme.md`

Инструкции по работе с учебным репозиторием.

### Файл `Contributing.md`

Советы и инструкции по внесению изменений в учебный репозиторий.

### Переменные окружения

- `PORT=4001` - номер порта, по которому подключается клиент;

- `HOST=localhost` - номер хоста, по которому запускается сервис;

- `SALT=text` - случайный набор символов для хеширования пароля;

- `DB_USER=admin` - имя пользователя базы данных;

- `DB_PASSWORD=test` - пароль пользователя базы данных;

- `DB_HOST=127.0.0.1` - IP-адрес сервера базы данных;

- `DB_PORT=27017` - порт сервера базы данных;

- `DB_NAME=six-cities` - название базы данных;

- `UPLOAD_DIRECTORY=upload` - название директории для загружаемых файлов;

- `STATIC_DIRECTORY=static` - название директории для статичных ресурсов;

- `JWT_SECRET=secret` - строка, которая будет использоваться в процессе шифрования.

### Остальное

Все остальные файлы в проекте являются служебными. Пожалуйста, не удаляйте и не изменяйте их самовольно. Только если того требует задание или наставник.
