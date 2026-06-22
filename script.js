{
  const кнопкаОтметитьДень = document.querySelector(".add-day-btn");
  const кнопкаУдалитьПоследнююЗапсиь = document.querySelector(
    ".удалить-последнюю-запись",
  );
  const полеВыводаСписка = document.querySelector(".feed-days-list");
  const список = document.querySelector(".лист_кормлений");
  const панельФормы = document.querySelector(".form-panel");
  const кнопкаЗакрытияФормы = document.querySelector(".close-form-panel-btn");
  const кнопкаОткрытияФормы = document.querySelector(".open-form-btn");
  const кнопкаОткрытияПанелиИнструментов =
    document.querySelector(".tools-panel-btn");
  const панельИнструментов = document.querySelector(".tools-panel");
  const кнопкаЗакрытияПанелиИнструментов = document.querySelector(
    ".tools-panel__close-btn",
  );
  const терминал = document.querySelector(".tools-panel__status-log");
  const кнопкаПредидущийМесяц = document.querySelector(".calendar__btn--prev");
  const кнопкаСледующийМесяц = document.querySelector(".calendar__btn--next");
  const кнопкаСохранитьВФайл = document.querySelector(".save-copy-file");
  const полеЗагрузкиКопии = document.querySelector(".upload-backup-input");

  const данныеВЛокальномХранилищеЕсть = localStorage.getItem("feeding_pichi");

  let текущийФокусКалендаря = new Date();
  let list = [];
  let выбраннаяДата = "";

  if (данныеВЛокальномХранилищеЕсть) {
    list = JSON.parse(данныеВЛокальномХранилищеЕсть);
    обновитьДанныеВПоле();
  }
  перерисоватьКалендарь();

  кнопкаОткрытияФормы.addEventListener("click", () => {
    панельФормы.classList.add("is-open");
    console.log("Бургер-кнопка сработала, форма открылась");
  });

  кнопкаЗакрытияФормы.addEventListener("click", () => {
    закрытьФорму();
    console.log("кнопка сработала, панель должна закрыться.");
  });

  кнопкаОткрытияПанелиИнструментов.addEventListener("click", () => {
    панельИнструментов.classList.add("is-open");
    console.log("Кнопка открытия панели инструментов нажата");
  });

  кнопкаЗакрытияПанелиИнструментов.addEventListener("click", () => {
    закрытьПанельИнструментов();
    console.log("панель инструментов закрылась");
  });

  кнопкаОтметитьДень.addEventListener("click", (e) => дирижёр(e));

  кнопкаУдалитьПоследнююЗапсиь.addEventListener("click", () =>
    удалитьПоследнююЗаписьМассива(list),
  );

  кнопкаПредидущийМесяц.addEventListener("click", () =>
    перелистнутьМесяцНазад(),
  );

  кнопкаСледующийМесяц.addEventListener("click", () =>
    перелистнутьМесяцВперёд(),
  );

  кнопкаСохранитьВФайл.addEventListener("click", () =>
    сохранитьРезервнуюКопиюФайла(),
  );

  полеЗагрузкиКопии.addEventListener("change", (e) =>
    загрузитьДанныеИзФайла(e),
  );

  function удалитьПоследнююЗаписьМассива(arr) {
    const objDelete = arr[arr.length - 1];
    const isDelete = confirm(`
            Удалить объект созданный ${objDelete.дата} в ${objDelete.время}. 
            Съела ${objDelete.колличество} шт. ${objDelete.витамины}, 
            ${objDelete.описание} 
            `);

    if (isDelete) {
      const удалённыйОбъект = arr.pop();
      console.log(
        `Запись "${удалённыйОбъект.дата} ${удалённыйОбъект.время}" удалена!`,
      );
    } else {
      console.log(`Запись "${arr[arr.length - 1]}" не удалена`);
    }

    записатьДанныеВХранилище();
    обновитьДанныеВПоле();
    перерисоватьКалендарь();
  }

  function дирижёр(event) {
    event.preventDefault();

    const date = собратьКарточкуКормления();
    list.push(date);
    записатьДанныеВХранилище();
    перерисоватьКалендарь();
    обновитьДанныеВПоле();
    закрытьФорму();
  }

  function получитьДатуString(obj) {
    const год = String(obj.getFullYear());
    const месяц = String(obj.getMonth() + 1).padStart(2, "0");
    const день = String(obj.getDate()).padStart(2, "0");

    return `${год}-${месяц}-${день}`;
  }

  function получитьВремяString(obj) {
    const часы = String(obj.getHours()).padStart(2, "0");
    const минуты = String(obj.getMinutes()).padStart(2, "0");
    const секунды = String(obj.getSeconds()).padStart(2, "0");

    return `${часы}:${минуты}:${секунды}`;
  }

  function собратьКарточкуКормления() {
    const моментВремени = Date.now();
    const текущаяДата = получитьДатуString(new Date(моментВремени));
    const текущееВремя = получитьВремяString(new Date(моментВремени));

    const формаКормления = document.forms.формаСбораДанныхКормления;

    const сколькоСъел = формаКормления.количествоСъеденыхСверчков.valueAsNumber;
    const какиеВитамины = формаКормления.типВитамин.value;
    const дополнительноеОписание =
      формаКормления.описаниеТекущегоКормления.value;

    const новыйОбъект = {
      id: моментВремени,
      дата: текущаяДата,
      время: текущееВремя,
      колличество: сколькоСъел,
      витамины: какиеВитамины,
      описание: дополнительноеОписание,
    };

    return новыйОбъект;
  }

  function обновитьДанныеВПоле() {
    список.innerHTML = "";

    if (!выбраннаяДата) return;

    let дляВыводаВСтроку = "";
    let нашлиЗапись = false;

    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];

      if (item.дата === выбраннаяДата) {
        нашлиЗапись = true;
        дляВыводаВСтроку += `<li>${item.дата} в ${item.время} - Скушала: ${item.колличество} шт. (${item.витамины})</li>`;
      }
    }

    if (!нашлиЗапись) {
      дляВыводаВСтроку = `<li>Пичи ${выбраннаяДата} не ела.</li>`;
    }

    список.innerHTML = дляВыводаВСтроку;
  }

  function записатьДанныеВХранилище() {
    const строка = JSON.stringify(list);
    localStorage.setItem("feeding_pichi", строка);
  }

  function закрытьФорму() {
    панельФормы.classList.remove("is-open");
  }

  function закрытьПанельИнструментов() {
    панельИнструментов.classList.remove("is-open");
    вывестиВТерминал("Система готова!");
  }

  function нарисоватьДниНедели(кудаРисовать) {
    const nameDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    for (let i = 0; i < nameDays.length; i += 1) {
      const divElement = document.createElement("div");
      divElement.classList.add("calendar__day", "day-head");
      divElement.textContent = `${nameDays[i]}`;
      кудаРисовать.appendChild(divElement);
    }
  }

  function нарисоватьПустыеЯчейкиКалендаря(кудаРисовать) {
    const деньНеделиПервоеЧисло = получитьДеньНеделиПервогоЧислаМесца();

    for (let i = 0; i < деньНеделиПервоеЧисло - 1; i += 1) {
      const divElement = document.createElement("div");
      divElement.classList.add("calendar__day");
      divElement.textContent = "";
      кудаРисовать.appendChild(divElement);
    }
  }

  function нарисоватьШапкуКалендаря(
    кудаРисоватьГод,
    кудаРисоватьМесяц,
    год,
    месяц,
  ) {
    const nameMonths = [
      "Январь",
      "Февраль",
      "Март",
      "Апрел",
      "Май",
      "Июнь",
      "Июль",
      "Авгус",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    кудаРисоватьГод.textContent = год;
    кудаРисоватьМесяц.textContent = nameMonths[месяц];
  }

  function нарисоватьЧислаКалендаря(
    кудаРисовать,
    проверяемыйГод,
    проверяемыйМесяц,
  ) {
    const днейВМесяце = получитьКоличествоДнейТекущегоМесяца();
    const всеДатыКормления = получитьТолькоДатыКормления();
    const { год, месяц, число } = текущаяДата();

    for (let i = 0; i < днейВМесяце; i += 1) {
      const divElement = document.createElement("div");

      const месяцДвузначный = String(проверяемыйМесяц + 1).padStart(2, "0");
      const деньДвузначный = String(i + 1).padStart(2, "0");

      const былПриёмПищи = всеДатыКормления.includes(
        `${проверяемыйГод}-${месяцДвузначный}-${деньДвузначный}`,
      );
      const этоСегодняшнийДень =
        `${год}-${String(месяц + 1).padStart(2, "0")}-${String(число).padStart(2, "0")}` ===
        `${проверяемыйГод}-${месяцДвузначный}-${деньДвузначный}`;

      const этаДатаВыбрана = `${проверяемыйГод}-${месяцДвузначный}-${деньДвузначный}` === выбраннаяДата;

      divElement.classList.add("calendar__day");

      if (этоСегодняшнийДень) {
        divElement.classList.add("calendar__day--today");
      }

      divElement.addEventListener("click", () => {
        выбраннаяДата = `${проверяемыйГод}-${месяцДвузначный}-${деньДвузначный}`;
        обновитьДанныеВПоле();
        перерисоватьКалендарь();
      });

      if (былПриёмПищи) {
        divElement.classList.add("calendar__day--active");
      }

      if (этаДатаВыбрана) {
        divElement.classList.add("calendar__day--selected");
      }

      divElement.textContent = i + 1;
      кудаРисовать.appendChild(divElement);
    }
  }

  function перерисоватьКалендарь() {
    const { год, месяц } = получитьДанныеФокусаКалендаря();
    const годКалендаряElement = document.querySelector(".calendar__year");
    const месяцКалендаряElement = document.querySelector(
      ".calendar__month-name",
    );
    const calendarElement = document.querySelector(".calendar");
    calendarElement.innerHTML = "";

    нарисоватьШапкуКалендаря(
      годКалендаряElement,
      месяцКалендаряElement,
      год,
      месяц,
    );
    нарисоватьДниНедели(calendarElement);
    нарисоватьПустыеЯчейкиКалендаря(calendarElement);
    нарисоватьЧислаКалендаря(calendarElement, год, месяц);
  }

  function получитьТолькоДатыКормления() {
    const выборкаДат = [];

    list.forEach(function (el) {
      выборкаДат.push(el.дата);
    });

    return выборкаДат;
  }

  function текущаяДата() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();

    return {
      год: year,
      месяц: month,
      число: date,
    };
  }

  function получитьКоличествоДнейТекущегоМесяца() {
    const фокус = получитьДанныеФокусаКалендаря();
    const количествоДней = new Date(фокус.год, фокус.месяц + 1, 0).getDate();

    return количествоДней;
  }

  function получитьДеньНеделиПервогоЧислаМесца() {
    const фокус = получитьДанныеФокусаКалендаря();
    let деньНедели = new Date(фокус.год, фокус.месяц, 1).getDay();
    if (деньНедели === 0) {
      деньНедели = 7;
    }

    return деньНедели;
  }

  function получитьДанныеФокусаКалендаря() {
    return {
      год: текущийФокусКалендаря.getFullYear(),
      месяц: текущийФокусКалендаря.getMonth(),
    };
  }

  function перелистнутьМесяцВперёд() {
    const следующийМесяц = текущийФокусКалендаря.getMonth() + 1;
    текущийФокусКалендаря.setMonth(следующийМесяц);
    перерисоватьКалендарь();
  }

  function перелистнутьМесяцНазад() {
    const пердыдущийМесяц = текущийФокусКалендаря.getMonth() - 1;
    текущийФокусКалендаря.setMonth(пердыдущийМесяц);
    перерисоватьКалендарь();
  }

  function сохранитьРезервнуюКопиюФайла() {
    const строка = JSON.stringify(list, null, 2);
    const виртуальныйФайл = new Blob([строка], { type: `application/json` });
    const временнаяСсылка = URL.createObjectURL(виртуальныйФайл);
    const скрытаяСсылка = document.createElement("a");

    скрытаяСсылка.href = временнаяСсылка;
    скрытаяСсылка.download = "feedding_pichi_backup.json";

    скрытаяСсылка.click();

    URL.revokeObjectURL(временнаяСсылка);
  }

  function загрузитьДанныеИзФайла(event) {
    const файл = event.target.files[0];
    console.log("файл:", файл);
    if (!файл) return;
    event.target.value = "";

    const читатель = new FileReader();
    console.log("читатель = new FileReader():", читатель);
    читатель.readAsText(файл);
    читатель.onload = function () {
      try {
        const локальныйМассивДоСлияния = [...list];
        const массивИзФайла = JSON.parse(читатель.result);

        if (!Array.isArray(массивИзФайла) || массивИзФайла.length === 0) {
          вывестиВТерминал("Файл повреждён или содержит неверные данные");
          return;
        }

        const общийМассив = [...локальныйМассивДоСлияния, ...массивИзФайла];
        const очищенныйМассив = общийМассив.filter(
          (el, index) =>
            общийМассив.findIndex((item) => item.id === el.id) === index,
        );

        очищенныйМассив.sort((a, b) => a.id - b.id);

        const прилетелоИзФайла =
          очищенныйМассив.length - локальныйМассивДоСлияния.length;
        const былоТолькоВБраузере =
          очищенныйМассив.length - массивИзФайла.length;

        list = очищенныйМассив;

        записатьДанныеВХранилище();
        перерисоватьКалендарь();
        обновитьДанныеВПоле();

        if (прилетелоИзФайла > 0) {
          вывестиВТерминал(
            `Базы объединены! Из файла добавлено ${прилетелоИзФайла} записей.`,
          );
        }

        if (прилетелоИзФайла === 0 && былоТолькоВБраузере > 0) {
          вывестиВТерминал(
            `В файле нет новых данных, но локальная база браузера полнее на ${былоТолькоВБраузере} записей. Рекомендуется обновить файл бэкапа!`,
          );
        }

        if (прилетелоИзФайла === 0 && былоТолькоВБраузере === 0) {
          вывестиВТерминал(`Базы идентичны. Обновление не требуется.`);
        }
      } catch (ошибка) {
        вывестиВТерминал(
          "Не удалось прочитать файл. Убедитесь, что выбрали правильный файл резервной копии.",
        );
      }
    };
  }

  function вывестиВТерминал(текстСообщения, типЛога) {
    терминал.textContent = `${текстСообщения}`;
  }
}
