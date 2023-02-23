const { Telegraf } = require('telegraf');

const TOKEN = '6174041372:AAGtI-0SVQFgxzimZLYrlhzV42RQFAsWY38';
const bot = new Telegraf(TOKEN);

const web_link = 'http://localhost:3001/';
bot.command('oldschool', (ctx) => ctx.reply('Hello'));
bot.command('hipster', Telegraf.reply('λ'));
bot.command('poll', async (ctx) => {
  const pollQuestion = 'What is your favorite color?';
  const pollOptions = ['Red', 'Green', 'Blue'];
  const params = {
    question: pollQuestion,
    options: pollOptions,
    is_anonymous: false,
  };
  try {
    const poll = await ctx.replyWithPoll(pollQuestion, pollOptions, {
      is_anonymous: false,
    });
    console.log('Poll created: ', poll);
  } catch (error) {
    console.error('Error creating poll: ', error);
  }
});

bot.on('poll_answer', async (ctx) => {
  const answer = ctx.update.poll_answer;
  console.log(answer);
  // do something with the user's response
});

bot.launch();
