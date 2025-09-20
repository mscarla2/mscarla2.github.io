const Strategies = [
    {
      id: "ma_crossover",
      name: "Moving Average Crossover",
      description: "A trend-following strategy that buys when a short-term moving average crosses above a long-term one.",
      params: [
        { id: "short_ma", label: "Short MA Period", type: "number", default: 50 },
        { id: "long_ma", label: "Long MA Period", type: "number", default: 200 }
      ],
      rules: {
        entryLong: ({ data, i, params }) => data[i-1]?.shortMA < data[i-1]?.longMA && data[i].shortMA > data[i].longMA,
        exitLong: ({ data, i, params }) => data[i-1]?.shortMA > data[i-1]?.longMA && data[i].shortMA < data[i].longMA,
      }
    },
    {
      id: "rsi_reversion",
      name: "RSI Mean Reversion",
      description: "A mean-reversion strategy that buys when an asset is 'oversold' and sells when it is 'overbought'.",
      params: [
        { id: "rsi_period", label: "RSI Period", type: "number", default: 14 },
        { id: "oversold", label: "Oversold Threshold", type: "number", default: 30 },
        { id: "overbought", label: "Overbought Threshold", type: "number", default: 70 }
      ],
      rules: {
        entryLong: ({ data, i, params }) => data[i-1]?.rsi > params.oversold && data[i].rsi <= params.oversold,
        exitLong: ({ data, i, params }) => data[i].rsi >= params.overbought,
      }
    },
    {
      id: "donchian_breakout",
      name: "Donchian Channel Breakout",
      description: "A trend-following strategy that buys when the price breaks above the highest high of a past period.",
      params: [
        { id: "channel_period", label: "Channel Period", type: "number", default: 20 }
      ],
      rules: {
        entryLong: ({ data, i, params }) => data[i].close > data[i-1]?.donchianHigh,
        exitLong: ({ data, i, params }) => data[i].close < data[i-1]?.donchianMid,
      }
    },
    {
      id: "macd_crossover",
      name: "MACD Crossover",
      description: "A momentum strategy that buys when the MACD line crosses above the Signal line.",
      params: [
        { id: "fast_ema", label: "Fast EMA Period", type: "number", default: 12 },
        { id: "slow_ema", label: "Slow EMA Period", type: "number", default: 26 },
        { id: "signal_ema", label: "Signal Line EMA Period", type: "number", default: 9 }
      ],
      rules: {
        entryLong: ({ data, i, params }) => data[i-1]?.macd < data[i-1]?.signal && data[i].macd > data[i].signal,
        exitLong: ({ data, i, params }) => data[i-1]?.macd > data[i-1]?.signal && data[i].macd < data[i].signal,
      }
    },
    {
      id: "bollinger_breakout",
      name: "Bollinger Band Breakout",
      description: "A volatility breakout strategy that buys when the price closes above the upper Bollinger Band.",
      params: [
        { id: "bb_period", label: "BB Period", type: "number", default: 20 },
        { id: "bb_stddev", label: "BB Standard Deviations", type: "number", default: 2 }
      ],
      rules: {
        entryLong: ({ data, i, params }) => data[i].close > data[i].bollingerUpper,
        exitLong: ({ data, i, params }) => data[i].close < data[i].bollingerMiddle, // Exit when it reverts to the mean
      }
    }
  ];