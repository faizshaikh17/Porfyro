const productsGrid = document.getElementById('productsGrid');
const searchBox = document.getElementById('searchBox');
const categoryFilter = document.getElementById('categoryFilter');
const sortOptions = document.getElementById('sortOptions');
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const closeModal = document.getElementById('closeModal');
const cartContent = document.getElementById('cartContent');

let products = [];
let cart = [];
let selectedVarieties = [];


const API_URL = "http://localhost/products.php"

const loadProducts = async () => {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        console.log(data)

        products = data;

        products.forEach(product => {
            selectedVarieties[product.id] = product.varieties[0].id;
        });

        allCategories();
        allProducts();

        searchBox.addEventListener('input', () => {
            allProducts();  // Call allProducts on input
        });
        categoryFilter.addEventListener('change', () => {
            allProducts(); // Call allProducts on change
        });
        sortOptions.addEventListener('change', () => {
            allProducts();  // Call allProducts on change
        });

    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<div class="error">Failed to load products. Please try again later.</div>';
    }
}

const allCategories = () => {
    const categories = [...new Set(products.map(product => product.category))];
    categories.forEach((category) => {
        const option = document.createElement('option')
        option.value = category;
        option.textContent = category
        categoryFilter.appendChild(option);
    });
}

const allProducts = () => {
    const searchValue = searchBox.value.toLowerCase();
    const categoryValue = categoryFilter.value;

    let filterProducts = products.filter(product => {
        const searchMatch = product.name.toLowerCase().includes(searchValue);
        const categoryMatch = categoryValue === '' || product.category === categoryValue
        return searchMatch && categoryMatch
    })



    const sortValue = sortOptions.value;
    if (sortValue === 'low-to-high') {
        filterProducts.sort((a, b) => {

            const aVarietyId = selectedVarieties[a.id];
            const bVarietyId = selectedVarieties[b.id];
            const aVariety = a.varieties.find(variety => variety.id === aVarietyId);
            const bVariety = b.varieties.find(variety => variety.id === bVarietyId);

            return aVariety.price - bVariety.price;
        })
    }

    else if (sortValue === 'high-to-low') {
        filterProducts.sort((a, b) => {

            const aVarietyId = selectedVarieties[a.id];
            const bVarietyId = selectedVarieties[b.id];
            const aVariety = a.varieties.find(variety => variety.id === aVarietyId);
            const bVariety = b.varieties.find(variety => variety.id === bVarietyId);

            return bVariety.price - aVariety.price;
        })
    }

    productsGrid.innerHTML = '';

    if (filterProducts.length === 0) {
        productsGrid.innerHTML = '<div class="no-results">No products found matching your criteria.</div>';
        return;
    }

    filterProducts.forEach(product => {
        const selectedVarietyId = selectedVarieties[product.id]
        const selectedVariety = product.varieties.find(variety => variety.id === selectedVarietyId);

        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
        <img src ="${product.image_url}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-category">${product.category}</div>
            <div class="product-varieties">
                <div class="variety-selector" data-product-id="${product.id}">
                    ${product.varieties.map(variety => `
                        <div class="variety-option ${variety.id === selectedVarietyId ? 'selected' : ''}" 
                                 data-variety-id="${variety.id}">${variety.name}</div>
                                 `).join('')}
                        </div>
                        <div class="product-price">₹${selectedVariety.price}</div>
                         </div>
                <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
        `;

        productsGrid.appendChild(productElement);
    })
    document.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('variety-option')) {
            handlePriceChange(target);
        } else if (target.classList.contains('add-to-cart')) {
            addToCart(target);
        }
    });

    function handlePriceChange(selectedOption) {
        const productId = parseInt(selectedOption.parentElement.dataset.productId);
        const varietyId = parseInt(selectedOption.dataset.varietyId);
        const product = products.find(p => p.id === productId);
        const selectedVariety = product.varieties.find(v => v.id === varietyId);
        const priceElement = selectedOption.parentElement.nextElementSibling;

        selectedOption.parentElement.querySelectorAll('.variety-option').forEach(option => option.classList.remove('selected'));
        selectedOption.classList.add('selected');

        priceElement.textContent = `₹${selectedVariety.price}`;
    }




    function addToCart(button) {
        const productId = parseInt(button.dataset.productId);
        const product = products.find(p => p.id === productId);
        const varietyId = selectedVarieties[productId];
        const variety = product.varieties.find(v => v.id === varietyId);

        const itemIndex = cart.findIndex(item => item.productId === productId && item.varietyId === varietyId);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += 1;
        } else {
            cart.push({
                productId,
                varietyId,
                productName: product.name,
                varietyName: variety.name,
                price: variety.price,
                imageUrl: product.image_url,
                quantity: 1 //Added the missing quantity property.
            });
        }

        cartCounter();
        button.textContent = "Added";
        button.style.backgroundColor = '#2ecc71';

        setTimeout(() => {
            button.textContent = "Add to Cart";
            button.style.backgroundColor = '';
        }, 1000);
    }

    function cartCounter() {
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0); //Handle potential missing quantity.
        cartCount.textContent = totalItems;
    }
}
loadProducts();
