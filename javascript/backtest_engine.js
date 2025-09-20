// === Data Fetching via API ===
async function fetchAPIData(ticker, startDate, endDate, apiKey) {
    if (!ticker || !apiKey) {
        alert("Ticker and API Key must be provided.");
        return [];
    }
    const formattedTicker = ticker.includes('.') ? ticker : `${ticker}.US`;
    const url = `https://eodhistoricaldata.com/api/eod/${formattedTicker}?api_token=${apiKey}&period=d&fmt=json&from=${startDate}&to=${endDate}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
             throw new Error("Invalid data format received from API. Check your ticker or API key.");
        }
        return data;
    } catch (error) {
        console.error("Failed to fetch historical data:", error);
        alert(`Failed to fetch data: ${error.message}. The 'demo' key only works for AAPL.US, MSFT.US, etc.`);
        return [];
    }
}

// Helper for EMA calculation
function calculateEMA(data, period, key = 'close') {
    const k = 2 / (period + 1);
    if (data.length < period) return data; // Not enough data
    
    // Calculate initial SMA
    let ema = data.slice(0, period).reduce((sum, d) => sum + d[key], 0) / period;
    data[period - 1].ema = ema;

    // Calculate EMA for the rest
    for (let i = period; i < data.length; i++) {
        ema = (data[i][key] * k) + (ema * (1 - k));
        data[i].ema = ema;
    }
    return data;
}

// === Indicator Calculations (ALL LOGIC RESTORED) ===
function calculateIndicators(data, strategy, params) {
    if (!data || data.length === 0) return [];
    
    // RESTORED: Moving Average Calculation
    if (strategy.id === 'ma_crossover') {
        const short_p = params.short_ma;
        const long_p = params.long_ma;
        for (let i = 0; i < data.length; i++) {
            if (i >= short_p - 1) {
                data[i].shortMA = data.slice(i - short_p + 1, i + 1).reduce((s, v) => s + v.close, 0) / short_p;
            }
            if (i >= long_p - 1) {
                data[i].longMA = data.slice(i - long_p + 1, i + 1).reduce((s, v) => s + v.close, 0) / long_p;
            }
        }
    }
    
    // RESTORED: RSI Calculation
    if (strategy.id === 'rsi_reversion') {
        const period = params.rsi_period;
        let gains = 0, losses = 0;
        for (let i = 1; i < data.length; i++) {
            const change = data[i].close - data[i-1].close;
            // For the first 'period' days, just sum up gains and losses
            if (i <= period) {
                if (change > 0) gains += change;
                else losses += Math.abs(change);
            } 
            // After that, use the smoothing formula
            else {
                if (change > 0) {
                    gains = (gains * (period - 1) + change) / period;
                    losses = (losses * (period - 1)) / period;
                } else {
                    gains = (gains * (period - 1)) / period;
                    losses = (losses * (period - 1) + Math.abs(change)) / period;
                }
            }
            if (i >= period) {
                const rs = losses > 0 ? gains / losses : 100; // Avoid division by zero
                data[i].rsi = 100 - (100 / (1 + rs));
            }
        }
    }
    
    // RESTORED: Donchian Channel Calculation
    if (strategy.id === 'donchian_breakout') {
        const period = params.channel_period;
        for (let i = period - 1; i < data.length; i++) {
            const slice = data.slice(i - period + 1, i + 1);
            const high = Math.max(...slice.map(d => d.high));
            const low = Math.min(...slice.map(d => d.low));
            data[i].donchianHigh = high;
            data[i].donchianLow = low;
            data[i].donchianMid = (high + low) / 2;
        }
    }

    // MACD Calculation
    if (strategy.id === 'macd_crossover') {
        const fast = params.fast_ema, slow = params.slow_ema, signal = params.signal_ema;
        const emaFast = calculateEMA([...data], fast).map(d => d.ema);
        const emaSlow = calculateEMA([...data], slow).map(d => d.ema);
        for (let i = 0; i < data.length; i++) {
            if (emaFast[i] && emaSlow[i]) data[i].macd = emaFast[i] - emaSlow[i];
        }
        const macdData = data.filter(d => d.macd !== undefined).map(d => ({close: d.macd, date: d.date})); // Keep date for alignment
        const signalLine = calculateEMA(macdData, signal).map(d => d.ema);
        let signalIndex = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].macd !== undefined) {
                if(signalLine[signalIndex] !== undefined) {
                    data[i].signal = signalLine[signalIndex];
                }
                signalIndex++;
            }
        }
    }

    // Bollinger Bands Calculation
    if (strategy.id === 'bollinger_breakout') {
        const period = params.bb_period;
        const stdDevMultiplier = params.bb_stddev;
        for (let i = period - 1; i < data.length; i++) {
            const slice = data.slice(i - period + 1, i + 1);
            const mean = slice.reduce((sum, d) => sum + d.close, 0) / period;
            const stdDev = Math.sqrt(slice.reduce((sum, d) => sum + Math.pow(d.close - mean, 2), 0) / period);
            data[i].bollingerMiddle = mean;
            data[i].bollingerUpper = mean + (stdDev * stdDevMultiplier);
            data[i].bollingerLower = mean - (stdDev * stdDevMultiplier);
        }
    }

    return data;
}

// === Portfolio Manager ===
class Portfolio {
    constructor(initialCapital, commission) {
        this.initialCapital = initialCapital;
        this.cash = initialCapital;
        this.position = null;
        this.trades = [];
        this.equityCurve = [];
        this.commission = commission;
    }
    updateEquity(date, price) {
        const positionValue = this.position ? this.position.quantity * price : 0;
        const totalEquity = this.cash + positionValue;
        this.equityCurve.push({ date, totalEquity, price });
    }
    executeOrder(type, date, price, quantity) {
        const cost = price * quantity;
        if (type === 'Buy') {
            if (this.cash < cost + this.commission) return;
            this.cash -= (cost + this.commission);
            this.position = { quantity, entryPrice: price, entryDate: date, type: 'Long' };
        } else if (type === 'Sell' && this.position) {
            this.cash += (cost - this.commission);
            const pnl = (price - this.position.entryPrice) * this.position.quantity - (this.commission * 2);
            const pnlPct = ((price / this.position.entryPrice) - 1) * 100;
            this.trades.push({
                type: this.position.type,
                entryDate: this.position.entryDate,
                exitDate: date,
                entryPrice: this.position.entryPrice,
                exitPrice: price,
                quantity: this.position.quantity,
                pnl: pnl,
                pnlPct: pnlPct
            });
            this.position = null;
        }
    }
}

// === Orchestrator: Run Backtest ===
async function runBacktestEngine(config) {
    const historicalData = await fetchAPIData(config.asset, config.startDate, config.endDate, config.apiKey);

    if (!historicalData || historicalData.length === 0) {
        return { equityCurve: [], trades: [], metrics: {}, benchmarkCurve: [] };
    }
    
    // The first data point is used for benchmark, but indicators start later.
    // So we add an initial equity point before the loop.
    const portfolio = new Portfolio(config.initialCapital, config.commission);
    portfolio.updateEquity(historicalData[0].date, historicalData[0].close);
    
    const dataWithIndicators = calculateIndicators(historicalData, config.strategyObj, config.strategyObj.params);
    const strategy = config.strategyObj;

    for (let i = 1; i < dataWithIndicators.length; i++) {
        const data = dataWithIndicators;
        const currentBar = data[i];
        
        const signals = {
            entryLong: strategy.rules.entryLong({ data, i, params: strategy.params }),
            exitLong: strategy.rules.exitLong({ data, i, params: strategy.params }),
        };

        if (signals.entryLong && !portfolio.position) {
            const quantity = Math.floor(portfolio.cash / currentBar.close);
            if (quantity > 0) portfolio.executeOrder('Buy', currentBar.date, currentBar.close, quantity);
        } else if (signals.exitLong && portfolio.position) {
            portfolio.executeOrder('Sell', currentBar.date, currentBar.close, portfolio.position.quantity);
        }
        
        portfolio.updateEquity(currentBar.date, currentBar.close);
    }

    const metrics = calculateMetrics(portfolio.equityCurve, portfolio.trades);
    const benchmarkCurve = calculateBenchmark(dataWithIndicators, config.initialCapital);

    return {
        equityCurve: portfolio.equityCurve,
        trades: portfolio.trades,
        metrics: metrics,
        benchmarkCurve: benchmarkCurve.map(p => p.equity)
    };
}

// === Metrics & Benchmark Calculations ===
function calculateMetrics(equityCurve, trades) {
    if (equityCurve.length < 2) return { maxDrawdown: 0, sharpeRatio: 0, profitFactor: 0, winRate: 0, drawdownSeries: [] };

    let peak = -Infinity, maxDrawdown = 0;
    const drawdownSeries = equityCurve.map(point => {
        peak = Math.max(peak, point.totalEquity);
        const drawdown = peak > 0 ? ((peak - point.totalEquity) / peak) * 100 : 0;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
        return -drawdown;
    });
    
    const returns = [];
    for(let i = 1; i < equityCurve.length; i++) {
        returns.push((equityCurve[i].totalEquity - equityCurve[i-1].totalEquity) / equityCurve[i-1].totalEquity);
    }
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.map(r => Math.pow(r - meanReturn, 2)).reduce((a, b) => a + b, 0) / returns.length);
    const sharpeRatio = stdDev > 0 ? (meanReturn / stdDev) * Math.sqrt(252) : 0;

    const grossProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : Infinity;
    const winRate = trades.length > 0 ? (trades.filter(t => t.pnl > 0).length / trades.length) * 100 : 0;

    return { maxDrawdown, sharpeRatio, profitFactor, winRate, drawdownSeries };
}

function calculateBenchmark(data, initialCapital) {
    if (data.length === 0) return [];
    const startPrice = data[0].close;
    return data.map(bar => ({ date: bar.date, equity: initialCapital * (bar.close / startPrice) }));
}

window.BacktestEngine = { run: runBacktestEngine };