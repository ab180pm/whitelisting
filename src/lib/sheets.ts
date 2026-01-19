import type { KnowledgeItem } from "@/types/knowledge";

const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let gapiInited = false;
let gisInited = false;

export interface SheetsConfig {
  clientId: string;
  spreadsheetId: string;
  sheetName: string;
}

// 하드코딩된 스프레드시트 설정
const HARDCODED_SPREADSHEET_ID = "1HmNuAHtmt3r1n7b_yh0FpL1Mf3Y79r6AZeCTbGnEO5Q";
const HARDCODED_SHEET_NAME = "discourse_topics";

let config: SheetsConfig | null = null;

export const setConfig = (newConfig: SheetsConfig) => {
  config = newConfig;
};

export const getConfig = () => config;

export const initWithHardcodedConfig = (clientId: string) => {
  config = {
    clientId,
    spreadsheetId: HARDCODED_SPREADSHEET_ID,
    sheetName: HARDCODED_SHEET_NAME,
  };
};

export const initGapiClient = async () => {
  await gapi.client.init({});
  await gapi.client.load(DISCOVERY_DOC);
  gapiInited = true;
  maybeEnableAuth();
};

export const initGisClient = (
  clientId: string,
  onAuthChange: (isSignedIn: boolean) => void,
) => {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: (response) => {
      if (response.error !== undefined) {
        onAuthChange(false);
        return;
      }
      onAuthChange(true);
    },
  });
  gisInited = true;
  maybeEnableAuth();
};

const maybeEnableAuth = () => {
  if (gapiInited && gisInited) {
    // Ready for auth
  }
};

export const signIn = () => {
  if (!tokenClient) return;

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    tokenClient.requestAccessToken({ prompt: "" });
  }
};

export const signOut = () => {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token, () => {});
    gapi.client.setToken(null);
  }
};

export const isSignedIn = () => {
  return gapi.client.getToken() !== null;
};

// 시트 컬럼 매핑 (0-indexed)
const COLUMN_MAP = {
  id: 0,
  topic_title: 1,
  category: 2,
  post_content: 3,
  reply_content: 4,
  url: 5,
  topic_created_at: 6,
  topic_views: 7,
  num_post: 8,
  is_available: 9,
} as const;

const parseBoolean = (value: string | undefined): boolean | null => {
  if (value === undefined || value === "") return null; // 미검토
  if (value === "TRUE" || value === "true" || value === "1") return true; // 사용가능
  if (value === "FALSE" || value === "false" || value === "0") return false; // 사용불가
  return null;
};

export const fetchKnowledgeData = async (): Promise<KnowledgeItem[]> => {
  if (!config) throw new Error("Config not set");

  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: config.spreadsheetId,
    range: `${config.sheetName}!A2:J`, // 헤더 제외
  });

  const rows = response.result.values || [];

  return rows.map((row, index) => ({
    id: parseInt(row[COLUMN_MAP.id] || "0", 10),
    topic_title: row[COLUMN_MAP.topic_title] || "",
    category: row[COLUMN_MAP.category] || "",
    post_content: row[COLUMN_MAP.post_content] || "",
    reply_content: row[COLUMN_MAP.reply_content] || "",
    url: row[COLUMN_MAP.url] || "",
    topic_created_at: row[COLUMN_MAP.topic_created_at] || "",
    topic_views: parseInt(row[COLUMN_MAP.topic_views] || "0", 10),
    num_post: parseInt(row[COLUMN_MAP.num_post] || "0", 10),
    is_available: parseBoolean(row[COLUMN_MAP.is_available]),
    rowIndex: index + 2, // 1-indexed, 헤더 제외
  }));
};

export const updateKnowledgeAvailability = async (
  rowIndex: number,
  isAvailable: boolean,
): Promise<void> => {
  if (!config) throw new Error("Config not set");

  const columnLetter = "J"; // is_available 컬럼
  const range = `${config.sheetName}!${columnLetter}${rowIndex}`;

  await gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: config.spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[isAvailable ? "TRUE" : "FALSE"]],
    },
  });
};
