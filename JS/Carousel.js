/**
 * @class Cria um novo carrossel
 * @classdesc a classe aplica as propriedades para movimentação dos carroseis e modificação na posição dos elementos
 * na estrutura do DOM
 * @author Alessandro Lima de Miranda
 */
class Carousel
{
    /**
     * @var string nome do carrossel instanciado
     * @access private
     */
    #actualCarousel;

    /**
     * @var int multiplicador que indica quantos itens serão avançados
     * @access private
     */
    #step;

    /**
     * @var int valor de um único espaço entre cada elemento do carrossel
     * @access private
     */
    #margins;

    /**
     * 
     * @param {string} carouselName seletor da instância do carrossel - id ou class do carrossel
     * @param {int} step Quantidade de itens que serão avançados 
     * @param {*} margins - o tamanho de espaço entre cada item do slider
     */
    constructor(carouselName, step, margins)
    {
        this.#actualCarousel = document.querySelector(carouselName);
        this.#step = step;
        this.#margins = margins;

        this.loadCarouselInformations();
    }

    /**
     * @async
     * @returns {void}
     * @description verifica o carrossel atual e obtém as informações para gerar os itens
     */
    async loadCarouselInformations()
    {
        if(this.#actualCarousel.dataset.id === 'carousel-faq')
        {
            await this.getCarouselInformations('faqQuestions.json').then(resp => this.getFaqArticles(resp));
        }
        else
        {
            await this.getCarouselInformations('productsCarousel.json').then(resp => this.getSlideProducts(resp));
        }
    }

    /**
     * @async
     * @returns {Promise<string>} os dados do json
     * @description obtém as informações para preencher o carrossel de perguntas frequentes
     */
    getCarouselInformations(file)
    {
        return new Promise((resolve, reject) => {
            fetch(`https://alessandro-miranda.github.io/landing-colageno/data/${file}`)
                .then(resp => resolve(resp.json()))
                    .catch(e => reject(e));
        });
    }

    /**
     * 
     * @param {int} direction direção da seta que o usuário clicou 
     * @returns {void}
     * @description faz o translateX do carrossel e chama função para aplicar / remover o efeito de blur
     */
    slideMovement(direction)
    {
        if(this.#actualCarousel.classList.contains('transition')) return;
        
        this.#actualCarousel.classList.add('transition');

        this.#actualCarousel.style.webkitTransform = `translateX(${this.calcTranslateX(direction)}px)`;

        if(this.#actualCarousel.dataset.id === 'carousel-products') this.applyBlurEffect(direction);

        setTimeout(() => {
            this.modifySequence(direction);
        }, 700);
    }

    /**
     * 
     * @param {int} direction direção de visualização escolhida pelo usuário
     * @returns {int} o produto da direção 1 ou -1 pela equação de translação
     * @description retorna o produto da direção pelo produto da quantia de itens à serem avançados pela 
     * soma do tamanho do item do slider mais a margem pe
     */
    calcTranslateX(direction)
    {
        let translate;
        let item = this.#actualCarousel.querySelector('.slide');
        translate = window.getComputedStyle(item).width;
        translate = (parseInt(translate.replace('px', "")) + this.#margins) * this.#step;

        return direction * translate;
    }

    /**
     * 
     * @param {int} direction  direção de visualização escolhida pelo usuário
     * @returns {void}
     * @description verifica a direção que o carrossel de produtos será movimentado e aplica o efeito
     * de blur no elemento posterior ou anterir
     */
    applyBlurEffect(direction)
    {
        let itemActive = this.#actualCarousel.querySelector('.slide-active');

        itemActive.classList.remove('slide-active');
        
        if(direction === -1)
        {
            itemActive.nextElementSibling.classList.add('slide-active');
        }
        else
        {
            itemActive.previousElementSibling.classList.add('slide-active');
        }
    }

    /**
     * 
     * @param {int} direction direção de visualização escolhida pelo usuário
     * @returns {void}
     * @description retira o elemento da primeira ou última posição baseado na direção clicada
     */
    modifySequence(direction)
    {
        let firstAndLastSliderChild = this.getFirstAndLastSliderChilds();

        if(direction === 1)
        {
            if(this.#actualCarousel.dataset.id === 'carousel-faq' && this.#step > 1)
            {
                for(var i = 0; i < 3; i++)
                {
                    firstAndLastSliderChild = this.getFirstAndLastSliderChilds();
                    this.#actualCarousel.insertBefore(firstAndLastSliderChild.lastSliderChild, firstAndLastSliderChild.firstSliderChild);
                }
            }
            else
            {
                this.#actualCarousel.insertBefore(firstAndLastSliderChild.lastSliderChild, firstAndLastSliderChild.firstSliderChild);
            }
        }
        else if(direction === -1)
        {
            if(this.#actualCarousel.dataset.id === 'carousel-faq' && this.#step > 1)
            {
                for(var i = 0; i < 3; i ++)
                {
                    firstAndLastSliderChild = this.getFirstAndLastSliderChilds();
                    firstAndLastSliderChild.lastSliderChild.after(firstAndLastSliderChild.firstSliderChild);
                }
            }
            else
            {
                firstAndLastSliderChild.lastSliderChild.after(firstAndLastSliderChild.firstSliderChild);
            }
        }

        this.#actualCarousel.classList.remove('transition');
        this.#actualCarousel.style.webkitTransform = 'translateX(0px)';
    }

    /**
     * @returns {object}
     * @description obtém o primeiro e último filho do carrossel
     */
    getFirstAndLastSliderChilds()
    {
        let firstSliderChild = this.#actualCarousel.querySelector('.slide:first-child');;
        let lastSliderChild = this.#actualCarousel.querySelector('.slide:last-child');

        return {
            firstSliderChild,
            lastSliderChild
        };
    }


    /**
     * @returns {void}
     * @description gera os articles do carrossel de perguntas frequentes baseado num limite de caracteres
     */
    getFaqArticles(response)
    {
        response.map((elem, index) => {

            let showMoreButton = false, newResponse, caracters = elem.questions[0].response;
            let plusIcon = document.createElement('i');
            plusIcon.classList.add('fas', 'fa-plus', 'faq__carousel__item__btn__showMore')

            if(caracters.length > 180)
            {
                if(caracters.substring(180, 181) !== '<')
                {
                    newResponse = caracters.substring(0, 180) + '...';
                }
                else
                {
                    newResponse = caracters.substring(0, 182) + '...';
                }
                showMoreButton = true;
            }
            else
            {
                newResponse = caracters;
            }

            this.#actualCarousel.innerHTML += this.generateItems(elem, index, newResponse)

            if(showMoreButton) document.querySelector(`#btn-showMore${index}`).appendChild(plusIcon);
        });

        this.btnShowMoreInitiEvents();
    }

    /**
     * @param {object} response 
     * @returns void
     * @description gera os elementos do carrossel de produtos
     */
    getSlideProducts(response)
    {
        response.map((elem, index) => {
            this.#actualCarousel.innerHTML += this.generateItems(elem, index);
        });

        this.#actualCarousel.querySelector('.slide:nth-child(3)').classList.add('slide-active');
    }
    
    /**
     * 
     * @param {object} elem objeto contendo as informações que serão inseridas no faq 
     * @param {int} index indice do elemento no array original
     * @param {string} newResponse resposta reescrita para a seção do faq em caso de string maior de 180 caracteres
     */
    generateItems(elem, index, newResponse = '')
    {
        if(this.#actualCarousel.dataset.id === 'carousel-faq')
        {
            return `<article class="faq__carousel__items slide" data-id=${index}>
                    <h2>${elem.questions[0].question}</h2>
                    <p>
                        ${newResponse}
                    </p>
                    <div id="btn-showMore${index}"></div>
                </article>`;
        }
        else
        {
            return `<div class="slide" data-id=${index}>
                        <img src="${elem.imagem}"
                            alt="imagem do pote contendo algum tipo de colágeno colágeno">
                        <a href="${elem.url_product}">Comprar</a>
                    </div>`;
        }
    }

    /**
     * @returns {void}
     * @description inicia o evento do botão de ver mais dos elementos do carrossel de perguntas frequentes
     */
    btnShowMoreInitiEvents()
    {
        let btns = document.querySelectorAll('div[id*="btn-showMore"]');

        btns.forEach(btn => {
            btn.addEventListener('click', e => {

                if(e.target.tagName === 'I')
                {
                    let parent = e.target.parentNode;
                    parent = parent.parentNode;

                    this.getCompleteAnswer(parent)
                }
                if(e.target.tagName === "DIV")
                {
                    this.getCompleteAnswer(e.target.parentNode);
                }
            });
        });
    }

    /**
     * 
     * @param {object} parent elemento pai (article) onde está os textos à serem modificados
     * @returns {void}
     * @description Exibe o texto completo de determinado article 
     */
    getCompleteAnswer(parent)
    {
        this.getCarouselInformations('faqQuestions.json').then(resp => {
            resp.filter((elem, index) => {
                if(index === parseInt(parent.dataset.id))
                {
                    let p = parent.querySelector('p');

                    p.innerHTML = elem.questions[0].response;

                    if(elem.questions[0].response.length > 250)
                    {
                        parent.style.overflowY = 'scroll';
                    }
                }
            });
        });
    }

}