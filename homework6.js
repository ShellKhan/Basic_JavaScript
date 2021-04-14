"use strict";

/* Задача 1
 * Доработать модуль корзины.
 * a. Добавлять в объект корзины выбранные товары по клику на кнопке «Купить» без перезагрузки страницы
 * b. Привязать к событию покупки товара пересчет корзины и обновление ее внешнего вида
 */
function GoodItem(good) {
    this.id_product = good.id_product;
    this.product_name = good.product_name;
    this.price = good.price;
    if (good.quantity) {
        this.quantity = good.quantity;
    } else {
        this.quantity = 1;
    }
}
GoodItem.prototype.getSum = function() {
    return this.price * this.quantity;
}
GoodItem.prototype.render = function(type) {
    if (type == 'cart') {
        return `<dl><dd>Наименование:</dd><dt>${this.product_name}</dt><dd>Цена за штуку:</dd><dt>${this.price}</dt><dd>Количество:</dd><dt>${this.quantity}</dt><dd>Общая стоимость:</dd><dt>${this.getSum()}</dt></dl>`;
    } else if (type == 'catalog') {
        return `<dl><dd>Наименование:</dd><dt>${this.product_name}</dt><dd>Цена за штуку:</dd><dt>${this.price}</dt><dt><button class="buy" type="button" data-id="${this.id_product}">Купить</button><dt></dl>`;
    }
}
const cart = {
    cartListBlock: null,
    clearCartButton: null,
    goods: [],
    init() {
        this.cartListBlock = document.querySelector('#cart');
        this.clearCartButton = document.querySelector('.cart-btn');
        this.clearCartButton.addEventListener('click', () => this.clearCart());
        this.render();
    },
    render() {
        if (this.goods.length) {
            this.cartListBlock.innerHTML = '';
            this.goods.forEach(good => {
                this.cartListBlock.insertAdjacentHTML('beforeend', good.render('cart'));
            });
            this.cartListBlock.insertAdjacentHTML('beforeend', `<p>В корзине ${this.goods.length} позиций на общую сумму ${this.getCartPrice()}</p>`);
        } else {
            this.cartListBlock.textContent = 'Корзина пуста';
        }
    },
    getCartPrice() {
        return this.goods.reduce(function (price, good) {
            return price + good.getSum();
        }, 0);
    },
    clearCart() {
        this.goods = [];
        this.render();
    },
    checkId(id) {
        if (this.goods.length) {
            return this.goods.find(item => item.id_product === id);
        } else {
            return undefined;
        }
    },
    addGood(item) {
        if (this.checkId(item.id_product)) {
            this.checkId(item.id_product).quantity += item.quantity;
        } else {
            this.goods.push(new GoodItem(item));
        }
        this.render();
    }
};
const catalog = {
    catalogBlock: null,
    catalogButtons: null,
    goods: [],
    init() {
        this.catalogBlock = document.querySelector('#catalog');
        this.goods.push(new GoodItem({id_product: 1, product_name: "Сапог", price: 300}));
        this.goods.push(new GoodItem({id_product: 2, product_name: "Башмак", price: 150}));
        this.goods.push(new GoodItem({id_product: 3, product_name: "Туфля", price: 500}));
        this.render();
        this.catalogButtons = document.querySelectorAll('.buy');
        this.catalogButtons.forEach(btn => btn.addEventListener('click', (e) => cart.addGood(catalog.checkId(+e.target.dataset.id))));
    },
    render() {
        this.goods.forEach(good => {
            this.catalogBlock.insertAdjacentHTML('beforeend', good.render('catalog'));
        });
    },
    checkId(id) {
        if (this.goods.length) {
            return this.goods.find(item => item.id_product === id);
        } else {
            return undefined;
        }
    }
};

cart.init();
catalog.init();
