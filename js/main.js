const imageLink = 'https://lh3.googleusercontent.com/proxy/Wmhe7EX_abNayG1ViZctGtB6yuUpTEWPgfv2DgkVs-F_5iKDOPgG88yO8KHZHYn3twpfxI1ScGTAdX_QQ5R5Z4c2NjpwBrKHcbAZSuY';
let productTextHTML = '';

const products = [
    {id: 1, title: 'Notebook', price: 20000},
    {id: 2, title: 'Mouse', price: 1500},
    {id: 3, title: 'Keyboard', price: 5000},
    {id: 4, title: 'Gamepad', price: 4500},
];

const renderProduct = (title, price, img = imageLink) => {
    return productTextHTML += `<div class="product-item">
                <img src=${img} class='product-image'>
                <h3>${title}</h3>
                <p>${price}</p>
                <button class="by-btn">Добавить в корзину</button>
            </div>`;
};

const renderProducts = (list) => {
    list.map((item) => renderProduct(item.title, item.price));
    document.querySelector('.products').innerHTML = productTextHTML;
};

renderProducts(products);
