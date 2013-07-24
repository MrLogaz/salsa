exports.index = {
  head: {
    title: "Сальса жизнь",
    desc: "Описание сальса жизни в мета теге"
  },
  city: 2,
  authorized: true,
  user: {
    id: 1,
    login: "admin",
    fname: "Андрей",
    sname: "Логинов",
    school: 1,
    notice: [{msg: "Привет!"}, {msg: "Новый комментарий"}]
  },
  feeds: [
    {
      id: 1,
      author: { type: 'u', id: 1, login: 'admin', fname: "Андрей", sname: "Логинов" },
      type: 'a',
      preview: true,
      date: { d: '26', m: '4', y: '2013' },
      title: 'Какая-нибудь статья о сальсе, у которой в заголовке очень много букв',
      anons: 'Краткий анонс для статьи, содержащий небольшой кусок текста, завлекающий пользователя'
    },
    {
      id: 2,
      author: { type: 's', id: 1, login: 'clava', name: "Школа танцев - Клавелина" },
      type: 'n',
      preview: true,
      date: { d: '5', m: '11', y: '2012' },
      title: 'Это набор в новую группу Сальсы',
      anons: 'Каждую пятницу с 19.00-20.00 бачата для начинающих в Эль Ритмо!  Каждую субботу с 13.00-14.00 бачата для продолжающих! Мы научим вас вести партнершу так, чтобы она растаяла от счастья и доверять партнеру так, чтобы он хотел танцевать с вами бесконечно!!!'
    },
    {
      id: 3,
      author: { type: 's', id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
      type: 'e',
      preview: true,
      date: { d: '13', m: '7', y: '2013' },
      data: { 
        address: { city: 'Екатеринбург', street: 'Куйбышева', house: '125' },
        dateFrom: { d: '16', m: '12', y: '2013', H: '20', M: '30' },
        dateTo: { d: '18', m: '12', y: '2013', H: '23', M: '00' },
        price: '500',
        tel: '8-800-2000600'
      },
      title: 'Событие, масштабное глобальное',
      anons: 'Это событие, которое взорвет мозг всем пришедшим танцорам все возврастов и поколений'
    },
  ],
  w_users: [
    { id: 1, login: 'admin', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'admin', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'loga', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'ilona', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'mrloga', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'user', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'admin', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'mrloga', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'ilona', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'mrloga', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'mrloga', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'ilona', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'user', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'ilona', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'mrloga', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'ilona', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'mrloga', fname: "Андрей", sname: "Логинов" },
    { id: 1, login: 'user', fname: "Андрей", sname: "Логинов" }
  ],
  w_schools: [
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" },
    { id: 1, login: 'clava', name: "КЛУБ - ЧЕгивара" }
  ]
};