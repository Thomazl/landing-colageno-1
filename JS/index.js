'use_strict';

let FaqCarousel, productsCarousel;

if(window.innerWidth > 1300)
{
    productsCarousel = new Carousel('#carousel', 1, 60);
    FaqCarousel = new Carousel('#carousel-faq', 3, 80);
}
else if(window.innerWidth > 1000)
{
    productsCarousel = new Carousel('#carousel', 1, 60);
    FaqCarousel = new Carousel('#carousel-faq', 3, 35);
}
else
{
    productsCarousel = new Carousel('#carousel', 1, 0);
    FaqCarousel = new Carousel('#carousel-faq', 1, 80);
}

const menuDropdowInit = () =>
{
    alert(window.innerWidth)
    let elements = document.querySelectorAll(".body-product-benefits-title, .body-product-benefits-plus-signal");

    elements.forEach(elem => {
        elem.addEventListener('click', e => {
            let parent = e.target.parentNode;
            let listElements = parent.querySelectorAll('ul li');
            let listElementsHeight = [...listElements].map(elem => {
                return elem.getBoundingClientRect().height;
            })

            listElementsHeight = [...listElementsHeight].reduce((acumulator, currentValue) => {
                return (acumulator + 1.5) + currentValue;
            })
            
            let counter = 0;

            if(parent.querySelector('span').textContent === '-')
            {
                parent.querySelector('ul').style.height = '0px';
                parent.querySelector('span').textContent = '+';
            }
            else
            {
                parent.querySelector('span').textContent = '-';
                while(counter < listElementsHeight)
                {
                    parent.querySelector('ul').style.height = `${counter + 20}px`;
                    counter += 10;
                }
            }
        });
    });
};

const changeFooterFixed = () => {
    if(window.pageYOffset > window.innerHeight * 1.2 && window.innerWidth > 1000)
    {
        document.querySelector('.footer-comprar-fixo').style.bottom = '45px';
    }
    else
    {
        document.querySelector('.footer-comprar-fixo').style.bottom = '-30%';
    }
    return;
}
window.addEventListener('load', menuDropdowInit);
document.addEventListener('scroll', changeFooterFixed);