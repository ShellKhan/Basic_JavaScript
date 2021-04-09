/* Задача 1
 * Создать функцию, генерирующую шахматную доску. При этом можно использовать любые html-теги по своему желанию. Доска должна быть разлинована соответствующим образом, т.е. чередовать черные и белые ячейки. Строки должны нумероваться числами от 1 до 8, столбцы – латинскими буквами A, B, C, D, E, F, G, H.
 */
function makeChessBoard() {
    let elem = document.createElement('table');
    let htmlstring = '';
    let letters = ' abcdefgh '
    for (let i =0; i < 10; i++) {
        htmlstring += '<tr>';
        for (let j = 0; j < 10; j++) {
            if (i == 0 || i == 9) {
                htmlstring += '<th>' + letters[j] + '</th>';
            } else {
                if (j == 0 || j == 9) {
                    htmlstring += '<th>' + (9 - i) + '</th>';
                } else {
                    htmlstring += '<td></td>';
                }
            }
        }
        htmlstring += '</tr>';
    }
    elem.innerHTML = htmlstring;
    return elem;
}

/* Задача 2
 * Заполнить созданную таблицу буквами, отвечающими за шахматную фигуру, например К – король, Ф – ферзь и т.п.
 */
// Зачем буквы, когда есть шахматные фигуры?
function positionUnits() {
    let pos = document.querySelectorAll('#chess td');
    for (let num = 0; num < 64; num++) {
        switch(num) {
            case 0:
            case 7:
                pos[num].innerHTML = '&#9820;';
                break;
            case 1:
            case 6:
                pos[num].innerHTML = '&#9822;';
                break;
            case 2:
            case 5:
                pos[num].innerHTML = '&#9821;';
                break;
            case 56:
            case 63:
                pos[num].innerHTML = '&#9814;';
                break;
            case 57:
            case 62:
                pos[num].innerHTML = '&#9816;';
                break;
            case 58:
            case 61:
                pos[num].innerHTML = '&#9815;';
                break;
            case 3:
                pos[num].innerHTML = '&#9819;';
                break;
            case 4:
                pos[num].innerHTML = '&#9818;';
                break;
            case 60:
                pos[num].innerHTML = '&#9812;';
                break;
            case 59:
                pos[num].innerHTML = '&#9813;';
                break;
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
                pos[num].innerHTML = '&#9823;';
                break;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
                pos[num].innerHTML = '&#9817;';
                break;
            default:
                pos[num].innerHTML = ' ';
                break;
        }
    }
}

// Сознаю, что сделал довольно неаккуратно, а главное неметодично - доску генерю так, фигуры иначе. Причиной личные обстоятельства, тупо времени не хватило на полировку. Лучше конечно было бы делать фигуры на афтерах, придавая клеткам поля соответствующие атрибуты (например data-chess), да и раскладывать не свитчом в отдельной функции, а ифами прямо в генерации доски.
function makeChess() {
    let old = document.querySelector('#chess table');
    if (old) old.remove();
    document.getElementById('chess').append(makeChessBoard());
    positionUnits();
}

/* Задача 3
 * Сделать генерацию корзины динамической: верстка корзины не должна находиться в HTML-структуре. Там должен быть только div, в который будет вставляться корзина, сгенерированная на базе JS:
 * 1) Пустая корзина должна выводить строку «Корзина пуста»;
 * 2) Наполненная должна выводить «В корзине: n товаров на сумму m рублей».
 */
const basket = {
    goods: [],
    addGoods(products) {
        for (product of products) {
            let addflag = true;
            for (good of this.goods) {
                if (good.id_product == product.id_product) {
                    good.quantity += product.quantity;
                    addflag = false;
                }
            }
            if (addflag) {
                this.goods.push(product);
            }
        }
    },
    countBasketPrice() {
        return this.goods.reduce((totalPrice, cartItem) => totalPrice + cartItem.price * cartItem.quantity, 0);
    },
    countBasketQty() {
        return this.goods.reduce((totalQty, cartItem) => totalQty + cartItem.quantity, 0);
    },
    findGoodById(id) {
        return this.goods.find((cartItem) => cartItem.id_product === id);
    },
    findGoodsByName(title) {
        return this.goods.filter((cartItem) => cartItem.product_name === title); // RegExp
    },
};
function makeBasket(aimid, goods='') {
    let aim = document.getElementById(aimid);
    if (goods.length) {
        basket.addGoods(JSON.parse(goods));
        console.log(basket.goods);
    }
    if (!basket.goods.length) {
        aim.innerHTML = '<p>Корзина пуста.</p>';
    } else {
        aim.innerHTML = '<p>В корзине ' + basket.countBasketQty() + ' товаров на сумму ' + basket.countBasketPrice() + ' рублей.</p>';
    }
}
// При проверке работы решения следует нажать сперва верхнюю кнопку, а потом нижнюю, так как удаления товаров из корзины я не делал. Если нажать в обратном порядке, корзина станет оба раза с товарами, а так она сперва пустая, а потом с товарами.
// Генерить на лету особо развесистую верстку корзины я не стал, поскольку во-1, реально очень загружен по времени, во-2, честное слово, это я научился делать году этак в 2012-м. Если это совершенно необходимо, я доделаю потом.

/* Задача 4
 * Сделать так, чтобы товары в каталоге выводились при помощи JS:
 * 1) Создать массив товаров (сущность Product);
 * 2) При загрузке страницы на базе данного массива генерировать вывод из него. HTML-код должен содержать только div id=”catalog” без вложенного кода. Весь вид каталога генерируется JS.
 */
// Прошу строго не судить, вывод сделал примитивный и гадкий, так как ненавижу дизайнить сам. Профдеформация такая.
// А формально-то там и верстка нормально генерится, и стили подхватываются.
const goods = [
    {
        id_product: 1,
        product_name: 'Сапог',
        price: 300,
        quantity: 2
    },
    {
        id_product: 2,
        product_name: 'Башмак',
        price: 150,
        quantity: 4
    },
    {
        id_product: 3,
        product_name: 'Туфля',
        price: 500,
        quantity: 1
    }
];
function showGoods() {
    let aim = document.getElementById('catalog');
    let htmlstring = '';
    for (good of goods) {
        htmlstring += '<dl>';
        for (attr in good) {
            htmlstring += '<dd>' + attr + '</dd>';
            htmlstring += '<dt>' + good[attr] + '</dt>';
        }
        htmlstring += '</dl>';
    }
    aim.innerHTML = htmlstring;
}
