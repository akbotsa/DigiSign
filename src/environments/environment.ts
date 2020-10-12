// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

declare var baseUrl: any; 

export const environment = {
  production: false,
  baseUrl : "http://15.207.202.132:7000/api/v1/",
  imageBaseUrl : "http://15.207.202.132:7000/api/v1/documents/document/",
  // baseUrl : "http://localhost:7000/api/v1/",
  // imageBaseUrl : "http://localhost:7000/api/v1/documents/document/",
  // baseUrl : "https://app.getendorse.co/api/v1/",
  // imageBaseUrl : "https://app.getendorse.co/api/v1/documents/document/", 

};

/*  
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
