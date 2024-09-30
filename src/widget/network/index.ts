import { getApiEndpoint } from "../utils/config";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT || getApiEndpoint();

export const post = ({ route, data, config, endpoint = ENDPOINT }: PostParams): Promise<any> => {
  return fetch(endpoint + route, {
    method: "POST",
    headers: {
      ...config.headers,
    },
    body: data,
  })
    .then(async (response) => {
      if (response.ok) {
        try {
          const jst = await response.json();
          return jst;
        } catch (err2) {
          return {};
        }
      } else {
        const err = await response.json();
        throw err;
      }
    })
    .catch((err) => {
      throw err;
    });
};

export const get = ({ route, config }: GetParams): Promise<any> => {
  return fetch(ENDPOINT + route, {
    method: "GET",
    headers: {
      ...config?.headers,
    },
  })
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      } else {
        const err = await response.json();
        throw err;
      }
    })
    .catch((err) => {
      throw err;
    });
};

type Config = {
  headers: object;
};

type GetParams = {
  route: string;
  config?: Config;
};
type PostParams = {
  route: string;
  data: any;
  config: Config;
  endpoint?: string;
};
