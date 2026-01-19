/// <reference types="vite/client" />

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenClient {
        requestAccessToken(options?: { prompt?: string }): void;
      }
      function initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: { error?: string; access_token?: string }) => void;
      }): TokenClient;
      function revoke(token: string, callback: () => void): void;
    }
  }
}

declare namespace gapi {
  function load(api: string, callback: () => void): void;
  namespace client {
    function init(config: object): Promise<void>;
    function load(discoveryDoc: string): Promise<void>;
    function getToken(): { access_token: string } | null;
    function setToken(token: null): void;
    namespace sheets {
      namespace spreadsheets {
        namespace values {
          function get(params: {
            spreadsheetId: string;
            range: string;
          }): Promise<{ result: { values?: string[][] } }>;
          function update(params: {
            spreadsheetId: string;
            range: string;
            valueInputOption: string;
            resource: { values: string[][] };
          }): Promise<void>;
        }
      }
    }
  }
}
