'use strict';
/*
/* DATA //////////////////////////////////////// */
const account1 = {
  owner: 'Nicholas Gillespie',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1,
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
  owner: 'Sarah John',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/*
/* ELEMENTS //////////////////////////////////////// */
const labelWelcome = document.getElementById('welcome');
const labelBalance = document.getElementById('balance');

const containerMain = document.querySelector('main');
const containerMovements = document.getElementById('movements');

const labelSumIn = document.querySelector('.sum-in');
const labelSumOut = document.querySelector('.sum-out');
const labelSumInterest = document.querySelector('.sum-int');
const btnSort = document.getElementById('btn-sort');

const inputLoginUsername = document.getElementById('login-user');
const inputLoginPassword = document.getElementById('login-pass');
const btnLogin = document.getElementById('login-btn');

const inputTransferReceiver = document.getElementById('transfer-to-user');
const inputTransferAmount = document.getElementById('transfer-amount');
const btnTransfer = document.getElementById('transfer-btn');

const inputLoan = document.getElementById('loan-amount');
const btnLoan = document.getElementById('loan-btn');

const inputCloseUser = document.getElementById('close-user');
const inputClosePin = document.getElementById('close-pin');
const btnClose = document.getElementById('close-btn');

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
const displayBalance = function (account) {
  account.balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0
  );
  labelBalance.textContent = `${account.balance} €`;
};

// DISPLAY SUMMARY > deposits, withdrawals, interest
const displaySummary = function (account) {
  const deposits = account.movements
    .filter((movement) => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumIn.textContent = `${deposits} €`;
  const withdrawal = account.movements
    .filter((movement) => movement < 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal)} €`;
  const interest = account.movements
    .filter((movement) => movement > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} €`;
};

// DISPLAY MOVEMENTS & SORT
const displayMovements = function (account, sort = false) {
  // innerHTML sets the HTML markup contained within the element
  containerMovements.innerHTML = '';

  // using slice() to create a copy because sort() mutates
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="[ box cluster ][ movement ]">
        <p class="type type--${type}">${index + 1} ${type}</p>
        <p>${movement} €</p>
      </div>
      `;
    // insertAdjacentHTML() parses the specified text as HTML and inserts the resulting nodes into the DOM tree at a specified position.
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// UPDATE UI
const updateUI = function (account) {
  // DISPLAY BALANCE
  displayBalance(currentAccount);

  // DISPLAY MOVEMENTS (movement, index)
  displayMovements(currentAccount);

  // DISPLAY SUMMARY
  displaySummary(currentAccount);
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

    // CLEAR INPUT FIELDS + BLUR CURSORS BLINK
    inputLoginUsername.value = inputLoginPassword.value = '';
    inputLoginUsername.blur();
    inputLoginPassword.blur();

    // UPDATE UI
    updateUI(currentAccount);
  }
});

let sort = false;
// SORT MOVEMENTS
btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  // using a state variable (sort) to monitor sort status
  displayMovements(currentAccount, !sort);
  sort = !sort;
});

// MAKING TRANSFERS
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (account) => account.username === inputTransferReceiver.value
  );
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // IMPLEMENT TRANSFER
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    // UPDATE UI
    updateUI(currentAccount);
    inputTransferReceiver.value = inputTransferAmount.value = '';
    inputTransferReceiver.blur();
    inputTransferAmount.blur();
  }
});

// CLOSING ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUser.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );
    accounts.splice(index, 1);
    document.documentElement.scrollTop = 0;
    containerMain.style.visibility = 'hidden';
  }
});

// REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoan.value);
  // movement needs to be greater than 10% of the requested amount
  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement >= amount * 0.1)
  ) {
    // ADD MOVEMENT
    currentAccount.movements.push(amount);
    // UPDATE UI
    updateUI(currentAccount);
    inputLoan.value = '';
    inputLoan.blur();
  }
});
