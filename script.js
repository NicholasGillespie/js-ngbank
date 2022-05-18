'use strict';
/*
/* DATA //////////////////////////////////////// */
const account1 = {
  owner: 'Nicholas Gillespie',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/*
/* ELEMENTS //////////////////////////////////////// */
const labelWelcome = document.getElementById('welcome');
const labelBalance = document.getElementById('balance');
const labelSumIn = document.querySelector('.sum-in');
const labelSumOut = document.querySelector('.sum-out');
const labelSumInterest = document.querySelector('.sum-int');

const containerMain = document.querySelector('main');
const containerMovements = document.getElementById('movements');

const inputLoginUsername = document.getElementById('login-user');
const inputLoginPassword = document.getElementById('login-pass');
const btnLogin = document.getElementById('login-btn');
// const btnTransfer

/*
/* FUNCTIONS //////////////////////////////////////// */
// CREATE USERNAMES
const createUsername = function (accounts) {
  accounts.forEach(function (account) {
    // creating a new property within each account objects
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name.charAt(0))
      .join('');
  });
};
createUsername(accounts);

// DISPLAY BALANCE
const displayBalance = function (movements) {
  const balance = movements.reduce((acc, movement) => {
    return acc + movement;
  }, 0);
  labelBalance.textContent = `${balance} €`;
};

// DISPLAY DEPOSITS
const displayDeposits = function (movements) {
  const deposits = movements
    .filter((movement) => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumIn.textContent = `${deposits} €`;
};
// DISPLAY WITHDRAWALS
const displayWithdrawals = function (movements) {
  const deposits = movements
    .filter((movement) => movement < 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumOut.textContent = `${deposits} €`;
};
// DISPLAY INTEREST
const displayInterest = function (movements) {
  const interest = movements
    .filter((movement) => movement > 0)
    .map((deposit) => (deposit * 1.2) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} €`;
};

// DISPLAY MOVEMENTS (movement, index)
const displayMovements = function (movements) {
  // innerHTML sets the HTML markup contained within the element
  containerMovements.innerHTML = '';

  movements.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="[ box cluster ][ movement ]">
        <p class="type type--${type}">${index} ${type}</p>
        <p>${movement} €</p>
      </div>
      `;
    // insertAdjacentHTML() parses the specified text as HTML and inserts the resulting nodes into the DOM tree at a specified position.
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/*
/* EVENT HANDLERS //////////////////////////////////////// */
let currentAccount; /* used throughout multi functions */

// LOGGING IN ⚠
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );
  // optional chaining = checks if currentAccount exists
  // .pin property will only be read if currentAccount exists
  if (currentAccount?.pin === Number(inputLoginPassword.value)) {
    //
    // DISPLAY WELCOME MESSAGE
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // DISPLAY APP
    containerMain.style.visibility = 'visible';

    // DISPLAY BALANCE
    displayBalance(currentAccount.movements);

    // DISPLAY MOVEMENTS (movement, index)
    displayMovements(currentAccount.movements);

    // DISPLAY SUMMARY
    displayDeposits(account1.movements);
    displayWithdrawals(account1.movements);
    displayInterest(account1.movements);
  }
});
