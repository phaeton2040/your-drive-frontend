export interface GetUserInterface {
  Username: string;
  UserAttributes: { Name: string, Value: string}[];
  error?: string;
}
