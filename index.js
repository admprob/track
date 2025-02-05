const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2');

// Token bot Telegram
const TOKEN = '8132722222:AAFcejkBNeAyXWOjId4BKB1av9CfYD3Uwck';

// Inisialisasi bot Telegram
const bot = new TelegramBot(TOKEN, { polling: true });

// Konfigurasi database MySQL
const db = mysql.createConnection({
  host: 'mysql-9zti.railway.internal',
  user: 'root',
  password: 'GhgOwzIKPodVSxysglwDfOBgKoVeplCg',
  database: 'railway',
  port: '3306',
});

// Sambungkan ke database
db.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
    process.exit(1);
  }
  console.log('Terhubung ke database.');
});

// Fungsi untuk menyimpan data ke MySQL
function saveToDatabase(username, message) {
 const query = 'INSERT INTO users (username, message) VALUES (?, ?)';
  db.query(query, [username, message], (err) => {
    if (err) {
      console.error('Gagal menyimpan data ke database:', err);
    } else {
      console.log('Data berhasil disimpan.');
    }
  });
}

// Fungsi untuk mengambil data dari MySQL
function getAllData(callback) {
  const query = 'SELECT * FROM db_onhand';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Gagal mengambil data dari database:', err);
      callback([]);
    } else {
      callback(results);
    }
  })
}

// Handler untuk perintah /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Halo! Kirimkan pesan untuk disimpan ke database.');
});

// Handler untuk perintah /show_data
bot.onText(/\/show_data/, (msg) => {
  const chatId = msg.chat.id;
  getAllData((data) => {
    if (data.length > 0) {
        console.log('Data dari tabel users:', data);
      const messages = data.map((row) => `${row.username}: ${row.message}`).join('\n');
      bot.sendMessage(chatId, `Data yang tersimpan:\n${messages}`);
    } else {
      console.log('Tabel kosong atau gagal mengambil data.');
      bot.sendMessage(chatId, 'Tidak ada data.');
    }
  });
});

// Handler untuk pesan biasa
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const username = msg.chat.username || 'Unknown';
    const message = msg.text;
    saveToDatabase(username, message);
    bot.sendMessage(msg.chat.id, 'Pesanmu telah disimpan!');
  }
});
