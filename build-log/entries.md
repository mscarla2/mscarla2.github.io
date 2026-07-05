## 2026-07-01 — Started the build log
Decided to keep a running log of Strategy Arena instead of writing occasional
polished posts. Realized it'd be good to have a running log that talks about
problems and methodology, not specific strategies or parameters. Will help
me learn and hopefull retain the info better!

## 2026-07-02 — Live trading, for real this time
Flipped the switch on live trading across the strategy set after months
of paper trading, backtesting and walk-forward validation. Numbers up top 
are the real combined result once there's enough history to make them 
meaningful, for now they're just hand picked values from recent runs.

## 2026-07-04 — Why walk-forward, not just a holdout
Spent a while explaining to myself (and now here) why a single out-of-sample
holdout isn't enough for anything evolutionary. It seems that genetic programming 
will happily overfit to whatever holdout you give it if you check it more than
once. Walk-forward re-splitting is slower to run but it's the only way I
trust the numbers that come out the other end.
