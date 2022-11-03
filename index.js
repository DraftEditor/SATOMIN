const {
  Client,
  Intents,
  MessageActionRow,
  MessageButton
} = require('discord.js');
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});
const password = process.env.PASSWORD;
client.on('messageCreate', async message => {
  //DM認証テスト
  if (message.content.startsWith("!AUTH")) {
    const msg = await client.users.cache.get(message.author.id).send("```パスワードを送信してください```");
    let filter = (m) => {
      m.author.id == message.author.id;
    };
    try {
      let collected = await msg.dmChannel.awaitMessages(filter, {
        max: 1,
        time: 400000,
      });
      let response = collected.first().content.toLowerCase();
      if (response === password) {
        msg.channel.send("認証完了");
        reaction.guild.member(user.id).roles.add("1037626635169566720");
        member.send("Test");
      } else {
        msg.channel.send("エラーが発生しました。再度コマンド入力からお試しください。");
      }
    } catch (e) {
      msg.channel.send("エラーが発生しました。再度コマンド入力からお試しください。");
    }
  }
  //グローバルBAN
  if (message.content.startsWith(`!gban`)) { // もしもコマンドがgbanだったら
    const args = message.content.split(" ");
    const gbanId = args[1]
    const reason = args[2]
    console.log(gbanId)
    console.log(reason)
    if (!gbanId) return message.reply('GbanIDを入力してください')
    if (!reason) return message.reply('理由を入力してください')
    const num = Math.floor(Math.random() * 9000000000) + 1000000000;
    const msg = await user.send(`次の数字を送信してください → ${num}`);
    msg.channel.awaitMessages((m) => true, { max: 1, time: 1000 * 60 })
      .then(collected => {
        if (!collected.size) return;
        const m = collected.first();
        if (m.content === String(num)) {
          try {
            client.guilds.cache.forEach(g => { // Botが参加しているすべてのサーバーで実行
              try {
                g.members.ban(gbanId, { reason }) // メンバーをBAN
                console.log(g.name + "でのGBANに成功しました"); // 成功したらコンソールに出す
              } catch (e) {
                console.log(g.name + "でのGBANの執行に失敗しました。\n" + e); // エラーが出たとき
              }
              message.reply('Gbanを執行しました')
            })
          } catch (e) {
            message.reply('Gbanの執行に失敗しました')
            console.log(e); // エラーが出たとき
          }
          msg.channel.send("認証完了");
          reaction.guild.member(user.id).roles.add("メンバーロールのID");
        } else {
          msg.channel.send("コードが違います\nリアクションからやり直してください");
        }
      });
  }
  //グローバルBAN解除
  if (message.content.startsWith(`!ungban`)) { // もしもコマンドがgbanだったら
    const args = message.content.split(" ");
    const gbanId = args[1]
    const reason = args[2]
    if (!gbanId) return message.reply('GbanIDを入力してください')
    if (!reason) return message.reply('理由を入力してください')
    try {
      client.guilds.cache.forEach(g => { // Botが参加しているすべてのサーバーで実行
        try {
          g.members.unban(gbanId, { reason }) // メンバーをBAN
          console.log(g.name + "でのGBAN解除に成功しました"); // 成功したらコンソールに出す
        } catch (e) {
          console.log(g.name + "でのGBANの解除に失敗しました。\n" + e); // エラーが出たとき
        }
        message.reply('Gbanを解除しました')
      })
    } catch (e) {
      message.reply('Gbanの解除に失敗しました')
      console.log(e); // エラーが出たとき
    }
  }
  //BAN
  if (message.content.startsWith("!ban")) {
    const msg = await client.users.cache.get(message.author.id).send("```パスワードを送信してください```");
    msg.channel.awaitMessages((m) => true, { max: 1, time: 1000 * 60 })
      .then(collected => {
        console.log("成功");
        if (!collected.size) return;
        const m = collected.first();
        if (m.content === String(password)) {
          msg.channel.send("認証完了");
          if (message.mentions.members.size !== 1)
            return message.channel.send('BANするメンバーを1人指定してください')
          const member = message.mentions.members.first()
          if (!member.bannable) return message.channel.send('このユーザーをBANすることができません')

          member.ban()

          message.channel.send(`${member.user.tag}をBANしました`)
        } else {
          msg.channel.send("パスワードが違います\nコマンド入力からやり直してください");
        }
      });
  }
  //チケット作成
  if (message.content.startsWith("!ticket")) {
    //!tiが打たれたら
    //権限確認
    const args = message.content.split(" ");
    //argsに空白で区切って配列にして1番目の文字を代入する
    if (!args[1]) return message.reply("タイトルがないよ");
    if (!args[2]) return message.reply("説明がないよ");
    //何も代入されていなかったら
    const tic1 = new MessageButton().setCustomId("ticket").setStyle("SUCCESS").setLabel("🎫チケット発行");
    //button作る
    await message.channel.send({
      embeds: [{
        title: String(args[1]),
        description: String(args[2])
      }],
      components: [new MessageActionRow().addComponents(tic1)]
    });
    //embedとbutton送信
    if (message.guild.channels.cache.find(name => name.name === "ticket")) return;
    //ticketというカテゴリーがあったらreturn
    message.guild.channels.create('ticket', {
      type: 'GUILD_CATEGORY'
    });
    //ticketというカテゴリーを作る
  }
})

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId === "ticket") {
    //ticketというIDのボタンが押されたら実行
    const ticketid = interaction.user.username
    //ticketIDはボタンを押したユーザーIDと同じと定義する
    if (interaction.guild.channels.cache.find(name => name.name === ticketid)) return interaction.reply({
      content: "これ以上作れないよ",
      //メッセージ
      ephemeral: true
      //その人にしか見れないようにする
    });
    //ギルドにユーザーIDのチャンネルがあったら処理をやめる
    const ct = interaction.guild.channels.cache.find(name => name.name === "ticket")
    //ticketというカテゴリーを探す
    if (!ct) return interaction.channel.send("ticketカテゴリーがありません");
    //見つからなかったら処理しない
    interaction.guild.channels.create(ticketid, {
      //チャンネルを作る
      permissionOverwrites: [{
        id: interaction.guild.roles.everyone,
        //すべての人(everyone)の権限設定
        deny: ['VIEW_CHANNEL']
        //チャンネルを見ることを禁止する
      }],
      parent: ct.id
      //ticketカテゴリーにチャンネルを作る
    }).then(channels => {
      //成功した場合
      channels.permissionOverwrites.edit(interaction.user.id, {
        //ボタンを押したユーザーのチャンネルない権限を変更
        VIEW_CHANNEL: true
        //チャンネルを見ることを許可する
      });
      const tic2 = new MessageButton().setCustomId("close").setStyle("PRIMARY").setLabel("閉じる");
      //buttonを作成
      channels.send({
        embeds: [{
          description: "チケットを閉じますか?"
        }],
        components: [new MessageActionRow().addComponents(tic2)]
        //buttonを送信
      })
      interaction.reply({
        content: `${channels}を作りました`,
        //メッセージ
        ephemeral: true
        //押した人にしか見れないようにする
      });
    }).catch(e => interaction.reply(`エラー:${e.message}`))
  }
  if (interaction.customId === "close") {
    //buttonIDがcloseのボタンが押されたら実行
    interaction.channel.delete().catch(e => interaction.reply(`エラー:${e.message}`))
    //チャンネルを消す(消せなかった場合はエラーを出す)
  }
});
client.login(process.env.DISCORD_TOKEN);