const players = [
  'Ben', 'Everett', 'Liam', 'Bobby', 'Henry',
  'Gio', 'Mikey', 'Miguel', 'Diagoras', 'Andy',
  'Peter', 'Caden'
];

const scorerSelect = document.getElementById('scorer');
const assistSelect = document.getElementById('assist');

players.forEach(player => {
  const opt1 = document.createElement('option');
  opt1.value = player;
  opt1.textContent = player;
  scorerSelect.appendChild(opt1.cloneNode(true));
  assistSelect.appendChild(opt1);
});

const grid = document.getElementById('goalGrid');
const locationNames = [
  'Top Left', 'Top Center', 'Top Right',
  'Middle Left', 'Middle Center', 'Middle Right',
  'Bottom Left', 'Bottom Center', 'Bottom Right'
];
let selectedIndex = null;

for (let i = 0; i < 9; i++) {
  const cell = document.createElement('button');
  cell.type = 'button';
  cell.addEventListener('click', () => {
    selectedIndex = i;
    [...grid.children].forEach(c => c.classList.remove('selected'));
    cell.classList.add('selected');
  });
  grid.appendChild(cell);
}

const output = document.getElementById('output');
const notice = document.getElementById('copyNotice');

document.getElementById('generate').addEventListener('click', () => {
  const scorer = scorerSelect.value;
  const assist = assistSelect.value;
  const time = document.getElementById('time').value;
  const details = document.getElementById('details').value;
  const location = selectedIndex !== null ? locationNames[selectedIndex] : '';
  const buildUp = [...document.querySelectorAll('.playOption:checked')].map(o => o.value);

  let message = `🚨 FSA Goal! 🚨\n`;
  message += `⚽️ Scorer: ${scorer}\n`;
  message += `🅰️ Assisted By: ${assist || 'None'}\n`;
  if (time) message += `🕒 Time of Goal: ${time}‘\n`;
  if (location) message += `📍 Goal Location: ${location}\n`;
  if (buildUp.length) message += `🔄 Build-Up: ${buildUp.join(', ')}\n`;
  if (details) message += `📝 Details: ${details}`;

  output.value = message.trim();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(output.value).then(() => {
      notice.textContent = 'Copied to clipboard!';
      setTimeout(() => notice.textContent = '', 2000);
    });
  }
});
