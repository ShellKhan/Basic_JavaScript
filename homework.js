/* Задача 1 
 * Дан код:
 * var a = 1, b = 1, c, d;
 * c = ++a; alert(c);           // 2
 * d = b++; alert(d);           // 1
 * c = (2+ ++a); alert(c);      // 5
 * d = (2+ b++); alert(d);      // 4
 * alert(a);                    // 3
 * alert(b);                    // 3
 * Почему код даёт именно такие результаты?
 */
// Потому что префиксный инкремент сперва увеличивает значение в переменной, а потом возвращает новое значение. Постфиксный же, наоборот, сперва возвращает исходное значение, а потом увеличивает значение в переменной:
// c = ++a;         -> a = a + 1 (a == 2); c = a (c == 2);
// d = b++;         -> d = b (d == 1); b = b + 1 (b == 2);
// c = (2+ ++a);    -> a = a + 1 (a == 3); c == 2 + a (c == 5);
// d = (2+ b++);    -> d == 2 + b (d == 4); b = b + 1 (b == 3);

/* Задача 2
 * Чему будет равен x в примере ниже?
 * var a = 2;
 * var x = 1 + (a *= 2);
 */
// 5.
// Присваивание возвращает присваиваемое значение - здесь a*=2 соответствует a=a*2 и возвращает a*2 (4)

/* Задача 3
 * Объявить две целочисленные переменные a и b и задать им произвольные начальные значения. Затем написать скрипт, который работает по следующему принципу:
 * если a и b положительные, вывести их разность;
 * если а и b отрицательные, вывести их произведение;
 * если а и b разных знаков, вывести их сумму; ноль можно считать положительным числом.
 */
// В качестве произвольных значений взял случайные целые числа от -500 до 500. Функцию объявил до объявления переменных, потому что на мой вкус так удобнее читать код.

function zadacha3(a, b) {
    if ((a < 0) && (b < 0)) {
        return a * b;
    } else if ((a < 0) || (b < 0)) {
        return a + b;
    } else {
        return a - b;
    }
}
var a, b;
a = Math.round((Math.random() - 0.5) * 1000);
b = Math.round((Math.random() - 0.5) * 1000);
console.log(a);
console.log(b);
console.log(zadacha3(a, b));
 
/* Задача 4
 * Присвоить переменной а значение в промежутке [0..15]. С помощью оператора switch организовать вывод чисел от a до 15.
 */ 
// Значение a генерируется случайно.

let a = Math.round(Math.random() * 15);
console.log(a);
switch(a) {
    case 0:
        console.log(0);
    case 1:
        console.log(1);
    case 2:
        console.log(2);
    case 3:
        console.log(3);
    case 4:
        console.log(4);
    case 5:
        console.log(5);
    case 6:
        console.log(6);
    case 7:
        console.log(7);
    case 8:
        console.log(8);
    case 9:
        console.log(9);
    case 10:
        console.log(10);
    case 11:
        console.log(11);
    case 12:
        console.log(12);
    case 13:
        console.log(13);
    case 14:
        console.log(14);
    case 15:
        console.log(15);
    break
    default:
        console.log('NOT IN RANGE!!!'); // обработка сделана для порядка, не может тут быть никаких других значений
    break
}

/* Задача 5
 * Реализовать основные 4 арифметические операции в виде функций с двумя параметрами. Обязательно использовать оператор return.
 */

function myAdd(x, y) {
    return x + y;
}
function mySub(x, y) {
    return x - y;
}
function myMul(x, y) {
    return x * y;
}
function myDiv(x, y) {
    return x / y;
}

/* Задача 6
 * Реализовать функцию с тремя параметрами: function mathOperation(arg1, arg2, operation), где arg1, arg2 – значения аргументов, operation – строка с названием операции. В зависимости от переданного значения операции выполнить одну из арифметических операций (использовать функции из пункта 5) и вернуть полученное значение (использовать switch).
 */
// Поскольку никаких уточнений в условии нет, использованы сокращенные обозначения операций:
// "add" - сложение,
// "sub" - вычитание,
// "mul" - умножение,
// "div" - деление.

function mathOperation(arg1, arg2, operation) {
    switch(operation) {
        case 'add':
            return myAdd(arg1, arg2);
        break
        case 'sub':
            return mySub(arg1, arg2);
        break
        case 'mul':
            return myMul(arg1, arg2);
        break
        case 'div':
            return myDiv(arg1, arg2);
        break
        default:
            return 'Не знаю такой операции';
        break
    }
}
// примеры использования функции
console.log(mathOperation(10, 15, "add")); // ожидается 25
console.log(mathOperation(2, 3, "mul")); // ожидается 6
console.log(mathOperation(25, 5, "div")); // ожидается 5
console.log(mathOperation(13, 2, "sub")); // ожидается 11
console.log(mathOperation(3, 3, "pow")); // ожидается 'Не знаю такой операции'

/* Задача 7
 * *Сравнить null и 0. Попробуйте объяснить результат.
 */

console.log(null === 0); // false - потому что типы не совпадают
console.log(null == 0); // false - потому что null не равно 0 по спецификации языка
console.log(null > 0); // false - потому что здесь null преобразуется для сравнения в число 0
console.log(null < 0); // false - потому что здесь null преобразуется для сравнения в число 0
console.log(null <= 0); // true - потому что здесь null преобразуется для сравнения в число 0
console.log(null >= 0); // true - потому что здесь null преобразуется для сравнения в число 0

/* Задача 8
 * *С помощью рекурсии организовать функцию возведения числа в степень. Формат: function power(val, pow), где val – заданное число, pow – степень.
 */
// Ограничиваемся целым неотрицательным показателем степени, так как иначе функция станет слишком уж сложной.
// По этой же причине проверку показателя на соответствие условию не делаю. Предположим, что юзер благонамерен и фигни не вводит.

function power(val, pow) {
    if (pow == 0) {
        return 1;
    } else {
        return val * power(val, pow - 1);
    }
}
// примеры использования функции
console.log(power(1,5)) // ожидается 1
console.log(power(5,2)) // ожидается 25
console.log(power(3,4)) // ожидается 81
console.log(power(2,10)) // ожидается 1024
