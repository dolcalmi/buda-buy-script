# Buda buy script
Just a script to buy crypto with Buda.com

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)

## Installation / Initial setup

* `git clone git@github.com:dolcalmi/buda-buy-script.git`
* `cd buda-buy-script`
* `npm i`

## Usage

### Options

- **`--base` or `-b`**\
Base currency (BTC, ETH, LTC).\
Default value: BTC
- **`--quote` or `-q`**\
Quote currency (COP, CLP, PEN, ARS).\
Default value: COP
- **`--amount` or `-a`**\
Quote amount.\
Default value: 0
- **`--apiKey` or `-k`**\
Buda api key.\
Default value: null
- **`--secret` or `-s`**\
Buda api secret.\
Default value: null

### Example
``` bash
> DEBUG=buda:* node index -b ETH -q COP -a 15000 -k YOUR_API_KEY -s YOUR_API_SECRET
```
