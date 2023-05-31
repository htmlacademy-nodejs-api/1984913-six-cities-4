export const LoggerInfoMessage = {
  InitApp: 'Application initialization...',
  Config: '.env file found and successfully parsed.',
  DbConnect:'Database connection established.',
  DbConnectInProgress:'Trying to connect to MongoDB...',
  DbDisconnect:'Database connection closed.',
  InitDb:'Init database...',
  InitDbDone:'Init database completed',
  InitServer:'Init server...',
  InitServerDone:'Server started on ',
  NewData:'New data created: ',
  NewRoute:'Route registered: ',
  RegisterRoute:'Register routes for ',
  InitController:'Controller initialization...',
  InitControllerDone:'Controller initialization completed',
}as const;

export const LoggerErrorMessage = {
  DbConnectFail: 'Failed to connect to the database. Attempt ',
  DbConnectMultipleFail: 'Unable to establish database connection.',
}as const;
