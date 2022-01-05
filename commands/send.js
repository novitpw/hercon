/**      ___  __   __   __
 * |__| |__  |__) /  ' /  \ |\ |
 * |  | |___ |  \ \__. \__/ | \|
 *
 * @copyright © 2022 hepller
 */

// Алиасы команды
const aliases = ['send', 'отправить' 's']

// Описание команды
const description = 'Отправка команды на сервер'

// Использование команды
const usage = '<название> <команда>'

// Функция команды
async function execute(ctx, {Logger, Rcon, db}) {

  // Проверка на наличие указанного сервера
  if (!ctx.args[0]) return ctx.reply('⛔ Вы не указали название сервера')

  // Поиск сервера в БД
  const server = db.data.servers.find(server => server.name == ctx.args[0])

  // Сообщение об отсутствии сервера
  if (!server) return ctx.reply(`⚠ Сервера с названием <<${ctx.args[0]}>> не существует`)

  // Соединение аргументов в команду
  const command = ctx.args.slice(1).join(' ')

  // Проверка на наличие указанной команды
  if (!command) return ctx.reply('⛔ Вы не указали команду для отправки на сервер')

  // Создание RCON
  const rcon = new Rcon(server.host, server.port, server.password)

  // Подключение к серверу
  rcon.connect()

  // Ожидание аутентификации -> отправка команды на сервер
  rcon.on('auth', () => rcon.send(command))

  // Обработка ответов сервера
  rcon.on('response', response => {

    // Отправка ответа пользователю
    ctx.reply([
      '💾 Ответ сервера:',
      '',
      response.replace(/§./g, '') || ctx.fields_placeholder
    ].join('\n'))

    // Отключение от сервера
    rcon.disconnect()
  })

  // Обработка ошибок
  rcon.on('error', error => {

    // Логирование ошибок
    Logger.logError(error.stack)

    // Отправка сообщения об ошибке пользователю
    ctx.reply(`⚠ При отправке команды на сервер <<${ctx.args[0]}>> возникла ошибка, возможно сервер выключен`)
  })
}

// Экспорт команды
export default {aliases, description, usage, execute}