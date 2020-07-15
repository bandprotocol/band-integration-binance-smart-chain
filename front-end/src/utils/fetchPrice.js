const fetchPrice = async () => {
  try {
    const { stdout } = await fetch(
      "https://dmptasv4j8.execute-api.ap-southeast-1.amazonaws.com/bash-execute",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/json;charset=UTF-8",
          pragma: "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
        },
        referrer: "https://guanyu-devnet.cosmoscan.io/data-source/14",
        referrerPolicy: "no-referrer-when-downgrade",
        body:
          '{"executable":"#!/usr/bin/env python3\\n\\nimport json\\nimport urllib.request\\nimport sys\\n\\nYAHOO_URL = \\"https://finance.yahoo.com/quote/{}\\"\\n\\n\\ndef make_json_request(url):\\n    return urllib.request.urlopen(url).read()\\n\\n\\ndef main(symbol):\\n    raw = make_json_request(YAHOO_URL.format(symbol)).decode()\\n    data = \\"\\".join(raw.split(\\"\\\\n\\")).split(\\n        \\"root.App.main = \\")[1].split(\\";}(this)\\")[0]\\n    return json.loads(data)[\\"context\\"][\\"dispatcher\\"][\\"stores\\"][\\"QuoteSummaryStore\\"][\\"price\\"][\\n        \\"regularMarketPrice\\"\\n    ][\\"raw\\"]\\n\\n\\nif __name__ == \\"__main__\\":\\n    try:\\n        print(main(*sys.argv[1:]))\\n    except Exception as e:\\n        print(str(e), file=sys.stderr)\\n        sys.exit(1)\\n","calldata":"M"}',

        method: "POST",
        mode: "cors",
        credentials: "omit",
      },
    ).then((r) => r.json());
    if (Number.isNaN(parseFloat(stdout))) {
      return null;
    }
    return parseFloat(stdout);
  } catch (e) {
    if (window.addLogs) {
      window.addLogs(JSON.stringify(e));
    } else {
      console.log(e);
    }
  }
  return null;
};

export { fetchPrice };
