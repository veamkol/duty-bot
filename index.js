const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let dutyData = {};

// Load data
if (fs.existsSync('data.json')) {
    dutyData = JSON.parse(fs.readFileSync('data.json'));
}

// Save data
function saveData() {
    fs.writeFileSync('data.json', JSON.stringify(dutyData, null, 2));
}

// Format waktu
function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    return `${hours} jam ${minutes} menit ${seconds} detik`;
}

client.on('ready', () => {
    console.log(`Bot aktif sebagai ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const userId = interaction.user.id;

    if (!dutyData[userId]) {
        dutyData[userId] = {
            total: 0,
            start: null
        };
    }

    // ================= DUTY =================
    if (interaction.commandName === 'duty') {
        const sub = interaction.options.getSubcommand();

        // ON
        if (sub === 'on') {
            if (dutyData[userId].start) {
                return interaction.reply('Kamu sudah duty!');
            }

            dutyData[userId].start = Date.now();
            saveData();

            return interaction.reply('Duty dimulai!');
        }

        // OFF
        if (sub === 'off') {
            if (!dutyData[userId].start) {
                return interaction.reply('Kamu belum duty!');
            }

            const duration = Date.now() - dutyData[userId].start;
            dutyData[userId].total += duration;
            dutyData[userId].start = null;

            saveData();

            return interaction.reply(`Duty selesai!\nTotal waktu: ${formatTime(dutyData[userId].total)}`);
        }

        // CEK
        if (sub === 'cek') {
            return interaction.reply(`Total duty kamu: ${formatTime(dutyData[userId].total)}`);
        }
    }

    // ================= RESET =================
    if (interaction.commandName === 'reset') {
        dutyData[userId] = { total: 0, start: null };
        saveData();

        return interaction.reply('Waktu duty berhasil direset!');
    }

    // ================= LEADERBOARD =================
    if (interaction.commandName === 'leaderboard') {
        let sorted = Object.entries(dutyData)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10);

        if (sorted.length === 0) {
            return interaction.reply('Belum ada data duty.');
        }

        let text = '🏆 Leaderboard Duty:\n';

        for (let i = 0; i < sorted.length; i++) {
            const userId = sorted[i][0];
            const total = sorted[i][1].total;

            text += `${i + 1}. <@${userId}> - ${formatTime(total)}\n`;
        }

        return interaction.reply(text);
    }

    // ================= REKAP =================
    if (interaction.commandName === 'rekap') {
        let text = '📊 Rekap Duty Semua Pegawai:\n';

        for (const userId in dutyData) {
            const total = dutyData[userId].total;

            if (total > 0) {
                text += `<@${userId}> - ${formatTime(total)}\n`;
            }
        }

        if (text === '📊 Rekap Duty Semua Pegawai:\n') {
            text += 'Belum ada data.';
        }

        return interaction.reply(text);
    }
});

client.login('MTQ4NTU5NjE5ODcwOTc2MDAzMA.GvpdMH.2TvqPFKJQZXf4Nvtnw0Zw8UjzmTdmpQyXy0H58');