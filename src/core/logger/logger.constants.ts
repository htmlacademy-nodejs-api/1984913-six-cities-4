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
