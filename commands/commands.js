/**      ___  __   __   __
 * |__| |__  |__) /  ' /  \ |\ |
 * |  | |___ |  \ \__. \__/ | \|
 *
 * @copyright © 2022 hepller
 */

// Алиасы команды
const aliases = ['commands', 'cmds', 'команды', 'кмдс']

// Описание команды
const description = 'Список команд'

// Функция команды
function execute(ctx, {Keyboard, commands, config}) {

  // Создание клавиатуры
  const keyboard = Keyboard.keyboard([
    Keyboard.textButton({
      label: 'Алиасы для команд',
      payload: {
        command: 'aliases'
      }
    })
  ])
  
  // Отправка сообщения
  ctx.reply([
    '💬 Команды бота:',
    '',
    '🌵 Для пользователей:',
    commands.map(cmd => `${config.general.command_symbols[0]}${cmd.aliases[0]} -- ${cmd.description || ctx.fields_placeholder}`).join('\n'),
    '',
    `📝 Префиксы команд: ${config.general.command_symbols.join(', ')}`
  ].join('\n'), {keyboard: keyboard.inline(true)})
}

// Экспорт команды
export default {aliases, description, execute}