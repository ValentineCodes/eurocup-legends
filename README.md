# ⚽️ 🏀 Sports Legends

## Features

- Mint a limited amount of shirts for each team at a specified price
- Creators split fees accordingly
- Admins can set the winner
- Winners can claim prize from the prize pool (SportsLegends.sol)
]
## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

> Clone this repo & install dependencies

```
git clone https://github.com/ValentineCodes/sports-legends.git
cd sports-legends
yarn install
```

> Run tests

```sh
yarn test
```
> In the same terminal, deploy contracts

Must set the enviromnent variables in hardhat as specified in `.env.example`

```sh
yarn deploy
```

The verification of the contracts may take a couple of minutes, so be aware of that if it seems that your terminal got stuck.
