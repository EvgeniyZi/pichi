{
    const кнопкаОтметитьДень = document.querySelector('.add-day-btn');
    const кнопкаУдалитьПоследнююЗапсиь = document.querySelector('.удалить-последнюю-запись');
    const полеВыводаСписка = document.querySelector('.feed-days-list');
    const список = document.querySelector('.лист_кормлений');
    let list = [];

    const данныеВХранилище = localStorage.getItem('feeding_pichi');

    if (данныеВХранилище) {
        list = JSON.parse(данныеВХранилище);
        перерисоватьКалендарь();
        обновитьДанныеВПоле();
    };
    
    кнопкаОтметитьДень.addEventListener('click', (e) => дирижёр(e));

    кнопкаУдалитьПоследнююЗапсиь.addEventListener('click', () => удалитьПоследнююЗаписьМассива(list));

    function удалитьПоследнююЗаписьМассива(arr) {
        const удалённыйОбъект = arr.pop();
        записатьДанныеВХранилище();
        обновитьДанныеВПоле();
    }

    function дирижёр(event) {
        event.preventDefault();

        const date = собратьКарточкуКормления();
        list.push(date);
        записатьДанныеВХранилище();
        перерисоватьКалендарь();
        обновитьДанныеВПоле();
        console.log(list);
    }

    function получитьДатуString(obj) {
        const год = String(obj.getFullYear());
        const месяц = String(obj.getMonth() + 1).padStart(2, '0');
        const день = String(obj.getDate()).padStart(2, '0')

        return `${год}-${месяц}-${день}`;
    }
    
    function получитьВремяString(obj) {
        const часы = String(obj.getHours()).padStart(2, '0');
        const минуты = String(obj.getMinutes()).padStart(2, '0');
        const секунды = String(obj.getSeconds()).padStart(2, '0');

        return `${часы}:${минуты}:${секунды}`;
    }

    function собратьКарточкуКормления() {
        const моментВремени = Date.now();
        const текущаяДата = получитьДатуString(new Date(моментВремени));
        const текущееВремя = получитьВремяString(new Date(моментВремени));

        const формаКормления = document.forms.формаСбораДанныхКормления;

        const сколькоСъел = формаКормления.количествоСъеденыхСверчков.valueAsNumber;
        const какиеВитамины = формаКормления.типВитамин.value;
        const дополнительноеОписание = формаКормления.описаниеТекущегоКормления.value;
        console.log('сколькоСъел', сколькоСъел);
        console.log('какиеВитамины', какиеВитамины);
        console.log('дополнительноеОписание', дополнительноеОписание);

        const новыйОбъект = {
            id: моментВремени,
            дата: текущаяДата,
            время: текущееВремя,
            колличество: сколькоСъел,
            витамины: какиеВитамины,
            описание: дополнительноеОписание
        }

        return новыйОбъект;
    }
        
    function обновитьДанныеВПоле() {
        список.innerHTML = '';
        for (let i = 0; i < list.length; i += 1) {
            const item = list[i];
            const liElement = document.createElement('li');
            liElement.classList.add(`list_${i}`);
            liElement.textContent = `№${[i]} _ ${item.дата} в ${item.время} - Скушала: ${item.колличество} шт. (${item.витамины})`; 
            список.append(liElement);
        }
    }

    function записатьДанныеВХранилище() {
        const строка = JSON.stringify(list);
        localStorage.setItem('feeding_pichi', строка);
    }

    function перерисоватьКалендарь() {
        const name = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const calendarElement = document.querySelector('.calendar');
        calendarElement.innerHTML = '';

        for (let i = 0; i < name.length; i += 1) {
            const divElement = document.createElement('div');
            divElement.classList.add('calendar__day', 'day-head');
            divElement.textContent = `${name[i]}`;
            calendarElement.appendChild(divElement);
        }
        
        const деньНеделиПервоеЧисло = получитьДеньНеделиПервогоЧислаМесца();
        
        for (let i = 0; i < деньНеделиПервоеЧисло - 1; i += 1) {
            const divElement = document.createElement('div');
            divElement.classList.add('calendar__day');
            divElement.textContent = '';
            calendarElement.appendChild(divElement);
        }        
        
        const днейВМесяце = получитьКоличествоДнейТекущегоМесяца();
        
        for (let i = 0; i < днейВМесяце; i += 1) {
            const divElement = document.createElement('div');
            const проверяемоеЧислоString = String(i + 1).padStart(2, '0');
            
            const даИлиНет = получитьТолькоДатыКормления().some((дата) => дата === `2026-06-${проверяемоеЧислоString}`);

            divElement.classList.add('calendar__day');

            if (даИлиНет) {
                divElement.classList.add('calendar__day--active');
            }

            divElement.textContent = i + 1;
            calendarElement.appendChild(divElement);
        }
    }

    function получитьТолькоДатыКормления() {
        const выборкаДат = [];
        
        list.forEach(function(el) {
            выборкаДат.push(el.дата);
        });

        return выборкаДат;
    }

    console.log(получитьТолькоДатыКормления());

    function текущаяДата() {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const date = new Date().getDate();

        return {
            год: year,
            месяц: month,
            число: date
        }
    }

    function получитьКоличествоДнейТекущегоМесяца() {
        const дата = текущаяДата();
        const количествоДней = new Date(дата.год, дата.месяц + 1, 0).getDate();
        
        return количествоДней;
    }
    
    function получитьДеньНеделиПервогоЧислаМесца() {
        const дата = текущаяДата();   
        let деньНедели = new Date(дата.год, дата.месяц, 1).getDay();
        if (деньНедели === 0) {
            деньНедели = 7;
        }

        return деньНедели;
    }


    const testButton = document.querySelector('.test');

    testButton.addEventListener('click', () => test());

    function test() {
        const текущийГод = new Date().getFullYear();
        const текущийМесяц = new Date().getMonth();
        console.log(`Текущий год ${текущийГод}`);
        console.log(`Текущий месяц ${текущийМесяц + 1}`);
        console.log(`кол-во дней текущего месяца: ${получитьКоличествоДнейТекущегоМесяца()}`);

        return получитьКоличествоДнейТекущегоМесяца();
    }

}

