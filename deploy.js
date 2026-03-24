const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('duty')
        .setDescription('Sistem duty')
        .addSubcommand(sub => sub.setName('on').setDescription('Mulai duty'))
        .addSubcommand(sub => sub.setName('off').setDescription('Stop duty'))
        .addSubcommand(sub => sub.setName('cek').setDescription('Cek total waktu')),

    new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reset waktu duty'),

    new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Ranking duty terlama'),

    new SlashCommandBuilder()
        .setName('rekap')
        .setDescription('Lihat semua duty user')
];

const rest = new REST({ version: '10' }).setToken('MTQ4NTU5NjE5ODcwOTc2MDAzMA.GvpdMH.2TvqPFKJQZXf4Nvtnw0Zw8UjzmTdmpQyXy0H58');

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands('1485596198709760030'),
            { body: commands },
        );
        console.log('Command berhasil diupdate!');
    } catch (error) {
        console.error(error);
    }
})();