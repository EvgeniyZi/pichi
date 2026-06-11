{
    const кнопкаОтметитьДень = document.querySelector('.add-day-btn');
    const кнопкаУдалитьПоследнююЗапсиь = document.querySelector('.удалить-последнюю-запись');
    const полеВыводаСписка = document.querySelector('.feed-days-list');
    const список = document.querySelector('.лист_кормлений');
    let текущийФокусКалендаря = new Date();

    let list = [];
    let выбраннаяДата = '';

    const данныеВХранилище = localStorage.getItem('feeding_pichi');

    if (данныеВХранилище) {
        list = JSON.parse(данныеВХранилище);
        перерисоватьКалендарь();
        обновитьДанныеВПоле();
    };
    
    кнопкаОтметитьДень.addEventListener('click', (e) => дирижёр(e));

    кнопкаУдалитьПоследнююЗапсиь.addEventListener('click', () => удалитьПоследнююЗаписьМассива(list));

    const кнопкаПредидущийМесяц = document.querySelector('.calendar__btn--prev');
    кнопкаПредидущийМесяц.addEventListener('click', () => перелистнутьМесяцНазад());
    
    const кнопкаСледующийМесяц = document.querySelector('.calendar__btn--next');
    кнопкаСледующийМесяц.addEventListener('click', () => перелистнутьМесяцВперёд());

    function удалитьПоследнююЗаписьМассива(arr) {
        const objDelete = arr[arr.length - 1];
        const isDelete = confirm(`
            Удалить объект созданный ${objDelete.дата} в ${objDelete.время}. 
            Съела ${objDelete.колличество} шт. ${objDelete.витамины}, 
            ${objDelete.описание} 
            `);

        if (isDelete) {
            const удалённыйОбъект = arr.pop();
            console.log(`Запись "${удалённыйОбъект.дата} ${удалённыйОбъект.время}" удалена!`);
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
        let нашлиЗапись = false;
        const liElement = document.createElement('li');

        for (let i = 0; i < list.length; i += 1) {
            const item = list[i];
            
            if (item.дата === выбраннаяДата) {
                нашлиЗапись = true;
                console.log('нашлиЗапись =', нашлиЗапись);    
                // liElement.classList.add(`list_${i}`);                
                liElement.textContent = `${item.дата} в ${item.время} - Скушала: ${item.колличество} шт. (${item.витамины})`; 
                список.append(liElement);
            }
            
            if (нашлиЗапись === false) {
                let выбраныйДень = выбраннаяДата;
                console.log(выбраныйДень, выбраныйДень.length);

                if (выбраныйДень.length > 0) {
                    liElement.textContent = `Пичи ${выбраныйДень} не ела.`;
                    список.append(liElement);
                }
            }
        }
    }

    function записатьДанныеВХранилище() {
        const строка = JSON.stringify(list);
        localStorage.setItem('feeding_pichi', строка);
    }

    function нарисоватьШапкуКалендаря() {
        // !!!!!!!!!!!!!! Тут хочу создать отдельную функцию но надо продумать как.
    }

    function перерисоватьКалендарь() {
        const nameDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const nameMonths = [
            'Январь', 'Февраль', 'Март', 'Апрел', 'Май', 'Июнь',
            'Июль', 'Авгус', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        const фокус = получитьДанныеФокусаКалендаря();
        document.querySelector('.calendar__year').textContent = фокус.год;
        document.querySelector('.calendar__month-name').textContent = nameMonths[фокус.месяц];

        const calendarElement = document.querySelector('.calendar');
        calendarElement.innerHTML = '';

        for (let i = 0; i < nameDays.length; i += 1) {
            const divElement = document.createElement('div');
            divElement.classList.add('calendar__day', 'day-head');
            divElement.textContent = `${nameDays[i]}`;
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
        const всеДатыКормления = получитьТолькоДатыКормления();
        
        for (let i = 0; i < днейВМесяце; i += 1) {
            const divElement = document.createElement('div');
            const проверяемоеЧислоString = String(i + 1).padStart(2, '0');
            const проверяемыйМесяцString = String(фокус.месяц + 1).padStart(2, '0');
            
            const даИлиНет = всеДатыКормления.includes(`${фокус.год}-${проверяемыйМесяцString}-${проверяемоеЧислоString}`);
            
            divElement.classList.add('calendar__day');
            
            divElement.addEventListener('click', () => {
                выбраннаяДата = `${фокус.год}-${проверяемыйМесяцString}-${проверяемоеЧислоString}`;
                обновитьДанныеВПоле();
            });
            
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
            месяц: текущийФокусКалендаря.getMonth()
        }
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


    const testButton = document.querySelector('.test');

    testButton.addEventListener('click', () => test());

    function test() {
        let newArr = [...list];
        console.log(newArr);
        console.log(newArr[newArr.length - 1]);
        let удалённыйОбъект = newArr.pop();
        // const текущийГод = new Date().getFullYear();
        // const текущийМесяц = new Date().getMonth();
        // console.log(`Текущий год ${текущийГод}`);
        // console.log(`Текущий месяц ${текущийМесяц + 1}`);
        // console.log(`кол-во дней текущего месяца: ${получитьКоличествоДнейТекущегоМесяца()}`);

        // return получитьКоличествоДнейТекущегоМесяца();
        console.log('удалённыйОбъект:', удалённыйОбъект);
        return console.log(list[list.length - 1].дата);
    }
}