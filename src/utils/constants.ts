export const HELP_TITLE = ' Программа для подготовки данных для REST API сервера.';
export const HELP_EXAMPLE = ' Пример: main.js --<command> [--arguments]  ';
export const HELP_COMMANDS = ` Команды:
  --version:                   # выводит номер версии
  --help:                      # печатает этот текст
  --import <path>:             # импортирует данные из TSV
  --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных`;

export const DB_RECONNECT_COUNT = 5;
export const DB_RECONNECT_TIMEOUT = 10000;

export const DEFAULT_DB_PORT = '27017';
export const DEFAULT_USER_PASSWORD = '123456';

export const ErrorMessage = {
  Import: 'Не удалось импортировать данные. Ошибка: ',
  Fetch: 'Can\'t fetch data from ',
  Config: 'Can\'t read .env file. Perhaps the file does not exist.',
  DbConnect:'Already connected to database',
  DbConnectFail:'Failed to connect to the database.',
  DbDisconnect:'Not connected to the database',
  Unauthorized:'Unauthorized',
  InvalidToken:'Invalid token',
  Undefined:'User undefined',
  NoStatus: 'There is no status query (true or false)'
}as const;

export const InfoMessage = {
  Import: 'Import completed. Rows amount: ',
  Generate: 'File successfully generated: ',
}as const;


export const ChunkSize = {
  Read:16384,
  Write: 2 ** 16
};

export const SORT_TYPE_DOWN = -1;

export const ControllerRoute = {
  Main:'/',
  OffersList:'/offers',
  Offer:'/:offerId',
  Premium:'/premium',
  Favorite:'/favorite',
  UsersList: '/users',
  User:'/:userId',
  Avatar: '/avatar',
  Register:'/register',
  Login:'/login',
  Comment: '/comments'
};

export const CommandName = {
  Help:'--help',
  Generate:'--generate',
  Import:'--import',
  Version:'--version'
};

export const MiddlewareName = {
  DocumentExists:'DocumentExistsMiddleware',
  ValidateObjectId:'ValidateObjectIdMiddleware',
  Authenticate:'AuthenticateMiddleware',
  PrivateRoute:'PrivateRouteMiddleware',
} as const;

export const ObjectIdParam = {
  UserId:'userId',
  OfferId:'offerId',
} as const;

export const EntityName = {
  User:'User',
  Offer:'Offer',
} as const;

