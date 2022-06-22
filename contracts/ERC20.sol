//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./IERC20.sol";
import "./Ownable.sol";

contract ERC20 is IERC20, Ownable {

  // account => balance
  mapping(address => uint256) private _balances;
  // account => (account of approved => approved amount)
  mapping(address => mapping(address => uint256)) private _allowances;

  uint256 private _maxSupply;
  uint256 private _totalSupply;
  string private _name;
  string private _symbol;

  event Mint(address indexed account, uint256 amount);

  constructor(string memory name_, string memory symbol_, uint256 maxSupply_) {
    _name = name_;
    _symbol = symbol_;
    _maxSupply = maxSupply_;
  }
  
  function mint(address account, uint256 amount) public onlyOwner {
    require(account != address(0), "ERC20: zero address");
    require(amount + _totalSupply <= _maxSupply, "ERC20: exceeds the max supply");
    _totalSupply += amount;
    _balances[account] += amount;
    emit Mint(account, amount);
  }
  
  function name() public view returns(string memory) {
    return _name;
  }

  function symbol() public view returns(string memory) {
    return _symbol;
  }
  
  function totalSupply() public view override returns (uint256) {
    return _totalSupply;
  }

  function balanceOf(address account) public view override returns (uint256) {
    return _balances[account];
  }
    
  function transfer(address to, uint256 amount) public override returns (bool) {
    _transfer(msg.sender, to, amount);
    return true;
  }
  
  function allowance(address owner, address spender) public view override returns (uint256) {
    return _allowances[owner][spender];
  }
  
  function approve(address spender, uint256 amount) public override returns (bool) {
    _allowances[msg.sender][spender] = amount;
    return true;
  }
  
  function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
    require(allowance(from, msg.sender) >= amount, "ERC20: insufficient allowance");
    _allowances[from][msg.sender] = _allowances[from][msg.sender] - amount;
    _transfer(from, to, amount);
    return true;
  }

  function _transfer(address _from, address _to, uint256 _amount) private {
    _balances[_from] = _balances[_from] - _amount;
    _balances[_to] = _balances[_to] + _amount;

    emit Transfer(_from, _to, _amount);
  }

}

