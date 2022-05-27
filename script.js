'use strict';
/*
/* DATA //////////////////////////////////////// */
const account1 = {
  owner: 'Nicholas Gillespie',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-05-20T17:01:17.194Z',
    '2022-05-26T16:36:17.929Z',
    '2022-05-27T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'fr-FR',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/*
/* ELEMENTS //////////////////////////////////////// */
const labelWelcome = document.getElementById('welcome');
const btnLogo = document.querySelector('.logo');
const labelBalance = document.getElementById('balance');
const labelBalanceDate = document.getElementById('balance-date');

const containerMain = document.querySelector('main');
const containerMovements = document.getElementById('movements');
const boxMovement = document.getElementById('movement');

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
  labelBalance.textContent = `${account.balance.toFixed(2)} €`;
};

// DISPLAY SUMMARY > deposits, withdrawals, interest
const displaySummary = function (account) {
  const deposits = account.movements
    .filter((movement) => movement > 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumIn.textContent = `${deposits.toFixed(2)} €`;
  const withdrawal = account.movements
    .filter((movement) => movement < 0)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal).toFixed(2)} €`;
  const interest = account.movements
    .filter((movement) => movement > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};

// TIME
const formatMovementDate = function (date) {
  // calculate days between now and date of movement
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} Days ago`;
  // if not captured by conditions with return, the following happens:
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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

    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementDate(date);

    const html = `
      <div class="[ box cluster ][ movement ]">
        <p class="type type--${type}">${index + 1} ${type}</p>
        <p id="mov-date">${displayDate}</p>
        <p id="mov">${movement.toFixed(2)} €</p>
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

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);

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

    // CREATE CURRENT DATE
    const now = new Date();
    const day = `${now.getDay()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelBalanceDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

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

let sort = false; /* state variable */
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
    // ADD TRANSFER DATE
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
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
    labelWelcome.textContent = 'Log in to get started';
  }
});

// REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoan.value);

  // movement needs to be greater than 10% of the requested amount
  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement >= amount * 0.1)
  ) {
    // ADD MOVEMENT
    currentAccount.movements.push(amount);
    // ADD TRANSFER DATE
    currentAccount.movementsDates.push(new Date().toISOString());
    // UPDATE UI
    updateUI(currentAccount);
    inputLoan.value = '';
    inputLoan.blur();
  }
});

btnLogo.addEventListener('click', function (e) {
  e.preventDefault;
  const movementsUI = Array.from(document.querySelectorAll('#mov'), (el) =>
    Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);

  console.log(
    [...document.querySelectorAll('.movement')].forEach((row, i) => {
      if (i % 2 === 1) row.style.backgroundColor = 'lightgreen';
    })
  );
});

/*
/* TESTS //////////////////////////////////////// */
// TOTAL DEPOSIT AMOUNT
const bankDepositSum = accounts
  .flatMap((account) => account.movements)
  .filter((movement) => movement > 0)
  .reduce((sum, movement) => sum + movement);
// console.log(bankDepositSum);

// NUMBER OF 1k+ DEPOSITS
const bigDeposits = accounts
  .flatMap((accounts) => accounts.movements)
  .filter((mov) => mov >= 1000).length;
// console.log(bigDeposits);

// const bday = new Date(' Feb 24 1986');
// const age = Date.now() - bday;
// console.log(age.toISOString());

// const now = Date.now();
// const bday = new Date('24 Feb 1986').getTime();

// console.log(new Date());

// console.log(now);
// console.log(bday);

// const daysPassed = function (now, date) {
//   return (now - date) / (1000 * 60 * 60 * 24 * 365);
// };

// const result = daysPassed(now, bday);
// console.log(`Days passed since : ${result}`);
