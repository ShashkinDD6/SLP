// Базовий тип для товару
type BaseProduct = {
  id: number;
  name: string;
  price: number;
  description: string; // Додаткове базове поле для опису товару
};

// Специфічний тип для електроніки
type Electronics = BaseProduct & {
  category: 'electronics';
  brand: string; // Бренд
  warranty: number; // Гарантія в місяцях
};

// Специфічний тип для одягу
type Clothing = BaseProduct & {
  category: 'clothing';
  size: string; // Розмір
  color: string; // Колір
};

// Специфічний тип для книг
type Book = BaseProduct & {
  category: 'books';
  author: string; // Автор
  pages: number; // Кількість сторінок
};

// Функція для пошуку товару за ID
// Повертає товар типу T або undefined, якщо не знайдено
// Перевіряє, чи products є масивом і id є числом
const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
  if (!Array.isArray(products)) {
    throw new Error('products must be an array');
  }
  if (typeof id !== 'number') {
    throw new Error('id must be a number');
  }
  return products.find(product => product.id === id);
};

// Функція для фільтрації товарів за максимальною ціною
// Повертає масив товарів типу T з ціною <= maxPrice
// Перевіряє, чи products є масивом і maxPrice є числом
const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
  if (!Array.isArray(products)) {
    throw new Error('products must be an array');
  }
  if (typeof maxPrice !== 'number') {
    throw new Error('maxPrice must be a number');
  }
  return products.filter(product => product.price <= maxPrice);
};

// Тип для елемента кошика
type CartItem<T> = {
  product: T;
  quantity: number;
};

// Функція для додавання товару до кошика
// Якщо товар вже в кошику, збільшує quantity; інакше додає новий
// Повертає оновлений масив кошика
// Перевіряє, чи cart є масивом, product є об'єктом і quantity є позитивним числом
const addToCart = <T extends BaseProduct>(
  cart: CartItem<T>[],
  product: T,
  quantity: number
): CartItem<T>[] => {
  if (!Array.isArray(cart)) {
    throw new Error('cart must be an array');
  }
  if (typeof product !== 'object' || product === null) {
    throw new Error('product must be an object');
  }
  if (typeof quantity !== 'number' || quantity <= 0) {
    throw new Error('quantity must be a positive number');
  }
  
  const existingItem = cart.find(item => item.product.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
    return [...cart];
  } else {
    return [...cart, { product, quantity }];
  }
};

// Функція для підрахунку загальної вартості кошика
// Повертає суму (product.price * quantity) для всіх елементів
// Перевіряє, чи cart є масивом
const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
  if (!Array.isArray(cart)) {
    throw new Error('cart must be an array');
  }
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Тестові дані
const electronics: Electronics[] = [
  {
    id: 1,
    name: "Телефон",
    price: 10000,
    description: "Смартфон з великим екраном",
    category: 'electronics',
    brand: "Samsung",
    warranty: 12
  },
  {
    id: 2,
    name: "Ноутбук",
    price: 25000,
    description: "Потужний ноутбук для роботи",
    category: 'electronics',
    brand: "Dell",
    warranty: 24
  }
];

const clothing: Clothing[] = [
  {
    id: 3,
    name: "Футболка",
    price: 500,
    description: "Бавовняна футболка",
    category: 'clothing',
    size: "M",
    color: "Чорний"
  },
  {
    id: 4,
    name: "Джинси",
    price: 1500,
    description: "Зручні джинси",
    category: 'clothing',
    size: "32",
    color: "Синій"
  }
];

const books: Book[] = [
  {
    id: 5,
    name: "TypeScript Handbook",
    price: 300,
    description: "Книга про TypeScript",
    category: 'books',
    author: "Anders Hejlsberg",
    pages: 200
  },
  {
    id: 6,
    name: "Clean Code",
    price: 400,
    description: "Книга про чистий код",
    category: 'books',
    author: "Robert C. Martin",
    pages: 464
  }
];

// Демонстрація роботи функцій

// Пошук товару
const phone = findProduct(electronics, 1);
console.log('Знайдений телефон:', phone);

// Фільтрація за ціною
const cheapClothing = filterByPrice(clothing, 1000);
console.log('Одяг дешевше 1000:', cheapClothing);

// Робота з кошиком
let cart: CartItem<Electronics | Clothing | Book>[] = []; // Кошик може містити різні типи, але для демонстрації використовуємо union

// Додаємо електроніку
if (phone) {
  cart = addToCart(cart as CartItem<Electronics>[], phone, 1); // Кастинг для типу
}

// Додаємо одяг
const tshirt = findProduct(clothing, 3);
if (tshirt) {
  cart = addToCart(cart as CartItem<Clothing>[], tshirt, 2); // Кастинг для типу
}

// Додаємо книгу
const book = findProduct(books, 5);
if (book) {
  cart = addToCart(cart as CartItem<Book>[], book, 1); // Кастинг для типу
}

// Підрахунок загальної вартості
const total = calculateTotal(cart as CartItem<BaseProduct>[]); // Кастинг до базового типу
console.log('Загальна вартість кошика:', total);

// Демонстрація з різними типами
const cheapBooks = filterByPrice(books, 350);
console.log('Книги дешевше 350:', cheapBooks);

const laptop = findProduct(electronics, 2);
console.log('Знайдений ноутбук:', laptop);