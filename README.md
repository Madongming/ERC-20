# An ERC20-implemented toy

npm i
(Optional) npm i hardhat

npx hardhat test
```
No need to generate any newer typings.


  ERC20
    ✔ Should return the erc20 name is Cody
    ✔ Should return the erc20 symbol is CD
    ✔ Should return the erc20 total supply is 0 before mint
    ✔ mint 1000, should return 1000 (47ms)
    ✔ Transfer amount to an account (51ms)
    ✔ approve amount to an account 10, check allowance should be 10
    ✔ Transfer 10 from an account to an other account, check balance should be 10 (66ms)
    ✔ Transfer 10 again, should failed
    ✔ AcountB Mint, Should be failed
    ✔ Mint token for address 0, Should be failed
    ✔ Mint token bigger than the max supply, Should be failed


  11 passing (1s)
```
