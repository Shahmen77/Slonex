import { db } from "./db";

export async function getPageContent({ slug }) {
  return await db.page.findUnique({
    where: { slug },
  });
}

export async function getPricingPlans() {
  return await db.pricingPlan.findMany({
    where: { isActive: true },
    orderBy: { priceEur: "asc" },
  });
}

export async function getContactInfo() {
  return await db.contactInfo.findFirst();
}

export async function getTranslations({ language }) {
  const translations = await db.translation.findMany({
    where: { language },
  });

  return translations.reduce(
    (acc, translation) => {
      acc[translation.key] = translation.value;
      return acc;
    },
    {},
  );
}

export async function _seedInitialData() {
  // Seed pages
  await db.page.createMany({
    data: [
      {
        slug: "home",
        title: "KYC Legal Entity",
        content:
          "Collection of all data about legal entities from open sources",
      },
      {
        slug: "about",
        title: "Info",
        content:
          "Information and analytical system for collecting information about legal entities from all open sources.",
      },
    ],
  });

  // Seed pricing plans
  await db.pricingPlan.createMany({
    data: [
      {
        name: "Light report",
        priceEur: 0.4,
        priceRub: 35,
        priceAmd: 165.5,
        description: "Basic information about legal entity",
      },
      {
        name: "Medium report",
        priceEur: 1.0,
        priceRub: 99,
        priceAmd: 468.5,
        description: "Extended information with additional details",
      },
      {
        name: "Full report",
        priceEur: 1.5,
        priceRub: 139,
        priceAmd: 657.5,
        description: "Complete comprehensive analysis",
      },
    ],
  });

  // Seed contact info
  await db.contactInfo.create({
    data: {
      address:
        "Jl. Dewi Saraswati No.22, Kerobokan Kelod, Kec. Kuta Utara, Kabupaten Badung, Bali 80361",
      email: "orgsafe.levon@gmail.com",
      organization: "PT Dewata Global Group",
      inn: "ИНН 9909677607",
      telegramBot: "https://t.me/sherlock_report_bot",
    },
  });

  // Seed translations (English, Russian, Armenian)
  const translations = [
    // English translations
    { key: "nav.about", language: "en", value: "About" },
    { key: "nav.plans", language: "en", value: "Plans" },
    { key: "nav.contacts", language: "en", value: "Contacts" },
    { key: "nav.account", language: "en", value: "Account" },
    { key: "hero.title", language: "en", value: "KYC Legal Entity" },
    {
      key: "hero.description",
      language: "en",
      value: "Collection of all data about legal entities from open sources",
    },
    { key: "hero.telegram_bot", language: "en", value: "Telegram bot" },
    { key: "info.title", language: "en", value: "Info" },
    {
      key: "info.description",
      language: "en",
      value:
        "Information and analytical system for collecting information about legal entities from all open sources.",
    },
    { key: "plans.title", language: "en", value: "Plans" },
    { key: "plans.request_prices", language: "en", value: "Request prices" },
    { key: "contacts.title", language: "en", value: "Contacts" },
    {
      key: "account.login_title",
      language: "en",
      value: "Login to personal account",
    },
    { key: "account.email", language: "en", value: "Email" },
    { key: "account.password", language: "en", value: "Password" },
    { key: "account.login", language: "en", value: "Login" },
    { key: "account.registration", language: "en", value: "Registration" },
    {
      key: "account.forgot_password",
      language: "en",
      value: "Forgot password?",
    },
    { key: "footer.user_agreement", language: "en", value: "User agreement" },
    {
      key: "footer.license_agreement",
      language: "en",
      value: "License agreement (offer)",
    },
    { key: "footer.bot", language: "en", value: "Bot" },

    // Russian translations
    { key: "nav.about", language: "ru", value: "О нас" },
    { key: "nav.plans", language: "ru", value: "Планы" },
    { key: "nav.contacts", language: "ru", value: "Контакты" },
    { key: "nav.account", language: "ru", value: "Аккаунт" },
    { key: "hero.title", language: "ru", value: "KYC Юридических Лиц" },
    {
      key: "hero.description",
      language: "ru",
      value: "Сбор данных о юридических лицах из открытых источников",
    },
    { key: "hero.telegram_bot", language: "ru", value: "Телеграм бот" },
    { key: "info.title", language: "ru", value: "Информация" },
    {
      key: "info.description",
      language: "ru",
      value:
        "Аналитическая система для сбора информации о юридических лицах из всех открытых источников.",
    },
    { key: "plans.title", language: "ru", value: "Планы" },
    { key: "plans.request_prices", language: "ru", value: "Запросить цены" },
    { key: "contacts.title", language: "ru", value: "Контакты" },
    {
      key: "account.login_title",
      language: "ru",
      value: "Вход в личный кабинет",
    },
    { key: "account.email", language: "ru", value: "Электронная почта" },
    { key: "account.password", language: "ru", value: "Пароль" },
    { key: "account.login", language: "ru", value: "Войти" },
    { key: "account.registration", language: "ru", value: "Регистрация" },
    { key: "account.forgot_password", language: "ru", value: "Забыли пароль?" },
    {
      key: "footer.user_agreement",
      language: "ru",
      value: "Пользовательское соглашение",
    },
    {
      key: "footer.license_agreement",
      language: "ru",
      value: "Лицензионное соглашение (оферта)",
    },
    { key: "footer.bot", language: "ru", value: "Бот" },

    // Armenian translations
    { key: "nav.about", language: "hy", value: "Մեր մասին" },
    { key: "nav.plans", language: "hy", value: "Պլաններ" },
    { key: "nav.contacts", language: "hy", value: "Կոնտակտներ" },
    { key: "nav.account", language: "hy", value: "Հաշիվ" },
    { key: "hero.title", language: "hy", value: "KYC Իրավաբանական անձինք" },
    {
      key: "hero.description",
      language: "hy",
      value:
        "Բոլոր տվյալների հավաքում իրավաբանական անձանց մասին բաց աղբյուրներից",
    },
    { key: "hero.telegram_bot", language: "hy", value: "Թելեգրամ բոտ" },
    { key: "info.title", language: "hy", value: "Տեղեկություն" },
    {
      key: "info.description",
      language: "hy",
      value:
        "Տեղեկատվական և վերլուծական համակարգ իրավաբանական անձանց մասին տեղեկություններ հավաքելու համար բոլոր բաց աղբյուրներից:",
    },
    { key: "plans.title", language: "hy", value: "Պլաններ" },
    { key: "plans.request_prices", language: "hy", value: "Հարցնել գները" },
    { key: "contacts.title", language: "hy", value: "Կոնտակտներ" },
    {
      key: "account.login_title",
      language: "hy",
      value: "Մուտք անձնական հաշիվ",
    },
    { key: "account.email", language: "hy", value: "Էլ. փոստ" },
    { key: "account.password", language: "hy", value: "Գաղտնաբառ" },
    { key: "account.login", language: "hy", value: "Մտնել" },
    { key: "account.registration", language: "hy", value: "Գրանցում" },
    {
      key: "account.forgot_password",
      language: "hy",
      value: "Մոռացել եք գաղտնաբառը?",
    },
    {
      key: "footer.user_agreement",
      language: "hy",
      value: "Օգտատիրոջ համաձայնություն",
    },
    {
      key: "footer.license_agreement",
      language: "hy",
      value: "Լիցենզային համաձայնություն (առաջարկ)",
    },
    { key: "footer.bot", language: "hy", value: "Բոտ" },
  ];

  await db.translation.createMany({
    data: translations,
  });
}

// Анимация появления элементов
document.addEventListener('DOMContentLoaded', () => {
  // Анимация для слова "Информация"
  const infoTitle = document.querySelector('.hero-title');
  if (infoTitle) {
    setTimeout(() => {
      infoTitle.classList.add('visible');
    }, 350);
  }

  // Анимация для кнопки "Телеграм-бот"
  const telegramBtn = document.querySelector('.hero-btn');
  if (telegramBtn) {
    setTimeout(() => {
      telegramBtn.classList.add('visible');
    }, 350);
  }
});
