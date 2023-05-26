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
  DbDisconnect:'Not connected to the database'
}as const;

export const InfoMessage = {
  Import: 'Import completed. Rows amount: ',
  Generate: 'File successfully generated: ',
}as const;

export const LoggerInfoMessage = {
  InitApp: 'Application initialization...',
  Config: '.env file found and successfully parsed.',
  DbConnect:'Database connection established.',
  DbConnectInProgress:'Trying to connect to MongoDB...',
  DbDisconnect:'Database connection closed.',
  InitDb:'Init database...',
  InitDbDone:'Init database completed',
  NewData:'New data created: ',
}as const;

export const LoggerErrorMessage = {
  DbConnectFail: 'Failed to connect to the database. Attempt ',
  DbConnectMultipleFail: 'Unable to establish database connection.',
}as const;

export const ChunkSize = {
  Read:16384,
  Write: 2 ** 16
};

export const DEFAULT_COMMENTS_AMOUNT = 0;

export const AppComponent = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseClientInterface: Symbol.for('DatabaseClientInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  LocationServiceInterface: Symbol.for('LocationServiceInterface'),
  LocationModel: Symbol.for('LocationModel'),
  OfferServiceInterface: Symbol.for('OfferServiceInterface'),
  OfferModel: Symbol.for('OfferModel'),
} as const;

export const UserNameLength = {
  Min: 1,
  Max: 15,
};
export const UserPasswordLength = {
  Min: 6,
  Max: 12,
};

export const OfferTitleLength = {
  Min: 10,
  Max: 100,
};

export const OfferDescriptionLength = {
  Min: 20,
  Max: 1024,
};

export const OfferRoomsAmount = {
  Min: 1,
  Max: 8,
};

export const OfferGuestsAmount = {
  Min: 1,
  Max: 10,
};

export const OfferRating = {
  Min: 1,
  Max: 5,
  Decimals:1,
};

export const OfferPrice = {
  Min: 100,
  Max: 100000,
};

export enum HomeType {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel'
}

export enum GoodType {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

export enum CityType {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf',
}

export enum UserStatus{
  Regular='regular',
  Pro='pro'
}
