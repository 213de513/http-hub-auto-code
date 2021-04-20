export interface ApiInterface {
  name: string;
  desc: string
}
export interface EolinkerApi {
  baseInfo: {
    apiName: string;
    apiNoteRaw: string;
    apiRequestType: string;
    apiURI: string;
  };
}
