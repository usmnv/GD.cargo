AOS.init({ duration: 900, once: true });

function sendForm(type) {
  const name = document.getElementById("name").value;
  const product = document.getElementById("product").value;
  const kg = document.getElementById("kg").value;
  const comment = document.getElementById("comment").value;

  const text = `
Заявка с сайта:
Имя: ${name}
Товар: ${product}
Вес: ${kg} кг
Комментарий: ${comment}
  `;

  if (type === "whatsapp") {
    const phone = "861380000000"; // WhatsApp номер
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  if (type === "telegram") {
    const telegramUsername = "usmnvl2"; // без @
    window.open(
      `https://t.me/${telegramUsername}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }
}

function animateValue(element, start, end, duration) {
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    element.innerHTML = Math.floor(progress * (end - start) + start) + " $";
    if (progress < 1) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}
function calculateDelivery() {
  const country = document.getElementById("country").value;
  const type = document.getElementById("deliveryType").value;
  const weight = parseFloat(document.getElementById("weight").value);

  let volume = parseFloat(document.getElementById("volume").value) || 0;

  const length = parseFloat(document.getElementById("length").value) || 0;
  const width  = parseFloat(document.getElementById("width").value) || 0;
  const height = parseFloat(document.getElementById("height").value) || 0;

  const result = document.getElementById("result");

  if (!weight) {
    result.innerHTML = "Введите вес";
    return;
  }

  // 👉 считаем объём из габаритов (см → м³)
  let volumeBySize = 0;
  if (length && width && height) {
    volumeBySize = (length * width * height) / 1000000;
  }

  const finalVolume = Math.max(volume, volumeBySize);

  let priceKg = 0;
  let priceM3 = 0;

  if (country === "ru") {
    if (type === "air")  { priceKg = 8;  priceM3 = 350; }
    if (type === "auto") { priceKg = 4;  priceM3 = 180; }
    if (type === "rail") { priceKg = 3;  priceM3 = 150; }
  }

  if (country === "tj") {
    if (type === "air")  { priceKg = 7;  priceM3 = 320; }
    if (type === "auto") { priceKg = 3.5; priceM3 = 160; }
    if (type === "rail") { priceKg = 2.8; priceM3 = 130; }
  }

  const total = Math.max(weight * priceKg, finalVolume * priceM3);

  animateValue(result, 0, total, 800);

  const message = `
Заявка с калькулятора:
Страна: ${country === "ru" ? "Россия" : "Таджикистан"}
Тип доставки: ${type}
Вес: ${weight} кг
Объём: ${finalVolume.toFixed(2)} м³
Габариты: ${length}×${width}×${height} см
Стоимость: ${total.toFixed(2)} $
`;

  // 🔹 WhatsApp
  const phone = "861380000000"; // ← ТВОЙ номер
  document.getElementById("whatsappBtn").href =
    "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

  // 🔹 Telegram
  const telegramUser = "usmnvl2"; // без @
  document.getElementById("telegramBtn").href =
    "https://t.me/" + telegramUser + "?text=" + encodeURIComponent(message);
}
function toggleDimensions() {
    const block = document.getElementById('dimensionsBlock');
    block.classList.toggle('hidden');
}


document.addEventListener("DOMContentLoaded", () => {
  const services = document.querySelectorAll(".service");
  const modal = document.getElementById("serviceModal");
  const title = document.getElementById("modalTitle");
  const text = document.getElementById("modalText");
  const icon = document.getElementById("modalIcon");
  const whatsapp = document.getElementById("modalWhatsapp");
  const telegram = document.getElementById("modalTelegram");

  const data = {
    air: {
      title: "Авиа доставка",
      text: " доставки грузов из Иу в Россию и Таджикистан. Подходит для срочных и ценных товаров.",
      icon: "fa-plane"
    },
    auto: {
      title: "Авто карго",
      text: "Оптимальное решение по цене и срокам. Регулярные отправки автотранспортом.",
      icon: "fa-truck-fast"
    },
    sea: {
      title: "Морская доставка",
      text: "Лучший вариант для больших объёмов и контейнерных перевозок.",
      icon: "fa-ship"
    },
    rail: {
      title: "ЖД доставка",
      text: "Стабильно и выгодно.",
      icon: "fa-train"
    },
    white: {
      title: "Белая доставка",
      text: "Белая доставка с официальной документацией(импорт/экспорт)",
      icon: "fa-box"
    },
    fulfillment: {
      title: "Фулфилмент",
      text: "Хранение и комплектация.",
      icon: "fa-warehouse"
    },
    express: {
      title: "Экспресс доставка",
      text: "Экспресс доставка документов",
      icon: "fa-bolt"
    },
    money: {
      title: "Трансфер средств",
      text: "Оплата поставщикам.",
      icon: "fa-money-bill-transfer"
    },
    warehouse: {
      title: "Склад в Иу",
      text: "Приём, хранение, консолидация и подготовка грузов к отправке.",
      icon: "fa-warehouse"
    },
    buyout: {
      title: "Выкуп товаров",
      text: "Выкуп товаров с 1688, Alibaba, Taobao с проверкой поставщика.",
      icon: "fa-cart-shopping"
    },
    packing: {
      title: "Упаковка",
      text: "Надёжная упаковка, фото и видео отчёт перед отправкой.",
      icon: "fa-box"
    },
    history: {
      title: "Отслеживание и контроль",
      text: "Полный контроль над грузом на всех этапах.",
      icon: "fa-search"
    },
  };

  services.forEach(service => {
    service.addEventListener("click", () => {
      const type = service.dataset.type;
      const serviceData = data[type];

      title.innerText = serviceData.title;
      text.innerText = serviceData.text;
      icon.className = "fa-solid " + serviceData.icon;

      const message = `Здравствуйте! Интересует услуга: ${serviceData.title}`;
      whatsapp.href = "https://wa.me/992924402211?text=" + encodeURIComponent(message);
      telegram.href = "https://t.me/yourtelegram?text=" + encodeURIComponent(message);

      modal.classList.add("show");
    });
  });
});


function closeService() {
  document.getElementById("serviceModal").classList.remove("show");
}
function showWarehouse(type) {
  const image = document.getElementById("warehouseImage");
  const title = document.getElementById("warehouseTitle");
  const text = document.getElementById("warehouseText");
  const list = document.getElementById("warehouseList");
  const buttons = document.querySelectorAll(".warehouse-tabs button");

  buttons.forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");

  const data = {
    yiwu: {
      title: "Склад в Иу",
      text: "Главный склад. Приём, проверка, упаковка и отправка грузов.",
      img: "img/yiwu.jpg",
      list: [
        "📦 Приём товаров",
        "📸 Фото и видео отчёт",
        "🚚 Отправка по СНГ"
      ]
    },
    guangzhou: {
      title: "Склад в Гуанчжоу",
      text: "Южный склад для фабрик и крупных производителей.",
      img: "img/guangzhou.jpg",
      list: [
        "🏭 Работа с фабриками",
        "📦 Консолидация",
        "🚢 Морские отправки"
      ]
    },
    urumqi: {
      title: "Склад в Урумчи",
      text: "Транзитный склад для авто и ЖД доставки.",
      img: "img/urumqi.jpg",
      list: [
        "🚚 Авто карго",
        "🚆 ЖД доставка",
        "⏱ Быстрое оформление"
      ]
    }
  };

  const w = data[type];

  image.src = w.img;
  title.innerText = w.title;
  text.innerText = w.text;

  list.innerHTML = "";
  w.list.forEach(i => {
    list.innerHTML += `<li>${i}</li>`;
  });
}

function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("show");
}

function closeMenu() {
  document.getElementById("navMenu").classList.remove("show");
}

function toggleFaq(element) {
  const faqItem = element.closest('.faq-item');
  faqItem.classList.toggle('active');
}