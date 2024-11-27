//@ts-nocheck
export const FT_MARKET = {
  0: "未知",
  1: "香港市场",
  11: "美国市场",
  21: "上海市场",
  22: "深圳市场",
  31: "新加坡市场",
  41: "日本市场"
};

export const FT_EXCHANGE_TYPE = {
  0: "未知",
  1: "港交所-主板",
  2: "港交所-创业板",
  3: "港交所",
  4: "纽交所",
  5: "纳斯达克",
  6: "OTC 市场",
  7: "美交所",
  8: "美国（仅美股期权适用）",
  9: "NYMEX",
  10: "COMEX",
  11: "CBOT",
  12: "CME",
  13: "CBOE",
  14: "上交所",
  15: "深交所",
  16: "大A科创板",
  17: "新交所",
  18: "大阪交易所"
};

export const FT_TRADE_ENV = {
  0: "模拟环境",
  1: "真实环境"
};

export const FT_FIRM = {
  0: "未知",
  1: "富途证券（香港）",
  2: "富途证券（美国）",
  3: "富途证券（新加坡）"
};

export const FT_ACC_TYPE = {
  0: "未知",
  1: "现金账户",
  2: "保证金账户"
};

export const FT_SIM_ACC_TYPE = {
  0: "未知",
  1: "股票模拟账户",
  2: "期权模拟账户"
};

export const FT_TRADE_MARKET_AUTH = {
  0: "未知市场",
  1: "香港市场（证券、期权）",
  2: "美国市场（证券、期权）",
  3: "A 股市场（仅用于模拟交易）",
  4: "A 股通市场（股票）",
  5: "期货市场（环球期货）"
};

export const FT_SUB_TYPE = {
  1: "基础报价",
  2: "摆盘",
  4: "逐笔",
  5: "分时",
  6: "日K",
  7: "5分K",
  8: "15分K",
  9: "30分K",
  10: "60分K",
  11: "1分K",
  12: "周K",
  13: "月K",
  14: "经纪队列",
  15: "季K",
  16: "年K",
  17: "3分K"
};
export const FT_SECURITY_TYPE = {
  0: "未知",
  1: "债券",
  2: "一揽子权证",
  3: "正股",
  4: "信托,基金",
  5: "窝轮",
  6: "指数",
  7: "板块",
  8: "期权",
  9: "板块集",
  10: "期货"
};

export const FT_POSITION_SIDE = {
  0: "未知",
  1: "买入",
  2: "卖出",
  3: "卖空",
  4: "买回"
};

export const FT_REHABTYPE = {
  0: "不复权",
  1: "前复权",
  2: "后复权"
};

export const FT_KL_TYPE = {
  0: "未知",
  1: "1分K",
  2: "日K",
  3: "周K",
  4: "月K",
  5: "年K",
  6: "5分K",
  7: "15分K",
  8: "30分K",
  9: "60分K",
  10: "3分K",
  11: "季K"
};

export const MA_TYPE = {
  1: "MA5",
  2: "MA10",
  3: "MA20",
  4: "MA30",
  5: "MA60",
  6: "MA120"
};

export function maTypeToCheckBoxOptions(){
  return Object.keys(MA_TYPE).map(rehabType => {
    return {
      label: MA_TYPE[rehabType],
      value: rehabType
    };
  });
}

export function rehabTypeToRadioOptions() {
  return Object.keys(FT_REHABTYPE).map(rehabType => {
    return {
      label: FT_REHABTYPE[rehabType],
      value: rehabType
    };
  });
}

export function parseRehabType(value: Number) {
  return FT_REHABTYPE[value];
}

export function parsePositionSide(value: Number) {
  return FT_POSITION_SIDE[value];
}

export function parseTradeMarketAuth(value: Number) {
  return FT_TRADE_MARKET_AUTH[value];
}

export function parseTradeEnv(value: Number) {
  return FT_TRADE_ENV[value];
}

export function parseMarket(marketValue: Number) {
  return FT_MARKET[marketValue];
}

export function parseExchangeType(exchangeValue: Number) {
  return FT_EXCHANGE_TYPE[exchangeValue];
}

export function parseFTsubType(code: Number) {
  return FT_SUB_TYPE[code];
}

export function parseSecurityType(code: Number) {
  return FT_SECURITY_TYPE[code];
}
