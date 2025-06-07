// Заглушка для базы данных
export const db = {
  page: {
    findUnique: async () => ({ title: 'Заглушка', content: 'Контент страницы.' }),
    createMany: async () => {},
  },
  pricingPlan: {
    findMany: async () => [],
    createMany: async () => {},
  },
  contactInfo: {
    findFirst: async () => ({ address: '', email: '', organization: '', inn: '' }),
    create: async () => {},
  },
  translation: {
    findMany: async () => [],
    createMany: async () => {},
  },
}; 