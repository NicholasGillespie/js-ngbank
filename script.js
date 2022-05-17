'use strict';

// DATA ////////////////////////////////////////
const account1 = {
  owner: 'Jonas Schmedtmann',
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

// ELEMENTS ////////////////////////////////////////
// const labelWelcome = document.getElementById('welcome');
// const labelBalance
// const containerMain
const containerMovements = document.getElementById('movements');
// const btnLogin
// const btnTransfer
// const inputLoginUsername

// FUNCTIONS ////////////////////////////////////////
// DISPLAY MOVEMENTS (movement, index)
const displayMovements = function (movements) {
  movements.forEach(function (movement, index) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="[ box cluster ][ movement ]">
        <p class="type type--${type}">${index} ${type}</p>
        <p>${movement} €</p>
      </div>
      `;
    // insert adjacent html -> select item & apply function
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);

// EVENT HANDLERS ////////////////////////////////////////

// account1.movements.forEach((movement) => console.log(movement));

// CREATE USERNAME
// const createUsername = function (account) {
//   console.log(
//     account.owner
//       .toLowerCase()
//       .split(' ')
//       .map((name) => name.charAt(0))
//       .join('')
//   );
// };
// console.log(createUsername(account1));

// INSERT MOVEMENTS IN HTML
// const displayMovements = function (params) {
//   const html = `
//   <div class="[ box cluster ][ movement ]">
//     <p>${} ${}</p>
//     <p>${}</p>
//     <p>${} €</p>
//   </div>
// `;
// };
