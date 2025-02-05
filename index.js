require("dotenv").config();
const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");

// Inisialisasi bot Telegram
const bot = new Telegraf(process.env.BOT_TOKEN);

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Definisi Model MongoDB
const DataSchema = new mongoose.Schema({
  name: String,
  value: String,
});
const DataModel = mongoose.model("Data", DataSchema);

// Command /start
bot.start((ctx) => ctx.reply("Halo! Gunakan /data untuk melihat data dari database."));

// Command /data untuk mengambil data dari MongoDB
bot.command("data", async (ctx) => {
  try {
    const data = await DataModel.find();
    if (data.length === 0) {
      ctx.reply("Tidak ada data dalam database.");
    } else {
      let message = "📌 Data dari database:\n";
      data.forEach((item) => {
        message += `\n🔹 ${item.name}: ${item.value}`;
      });
      ctx.reply(message);
    }
  } catch (error) {
    console.error(error);
    ctx.reply("Terjadi kesalahan saat mengambil data.");
  }
});

// Menjalankan bot
bot.launch();
console.log("Bot berjalan...");

// Menangani proses keluar
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
