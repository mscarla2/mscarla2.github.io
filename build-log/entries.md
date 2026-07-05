## 2026-07-01 — Started the build log
Decided to keep a running log of Strategy Arena instead of writing occasional
polished posts. Lower bar, more honest: what I tried, what broke, what I
learned. The repo itself stays private — this log talks about problems and
methodology, not specific strategies or parameters.

## 2026-07-02 — Paper trading, for real this time
Flipped the switch on live paper trading across the strategy set after months
of backtesting and walk-forward validation. Numbers up top are the real
combined result once there's enough history to make them meaningful — for
now they're placeholder so the layout isn't empty.

## 2026-07-04 — Why walk-forward, not just a holdout
Spent a while explaining to myself (and now here) why a single out-of-sample
holdout isn't enough for anything evolutionary — genetic programming will
happily overfit to whatever holdout you give it if you check it more than
once. Walk-forward re-splitting is slower to run but it's the only way I
trust the numbers that come out the other end.
