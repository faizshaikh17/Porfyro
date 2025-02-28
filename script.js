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
let selectedVarieties = {};

const API_URL = "http://localhost/products.php"

const loadProducts = async () => {
    try {
        const res = await fetch(API_URL);
        const data = res.json();
        console.log(data)

        products = data;

        products.forEach(product => {
            selectedVarieties[product.id] = product.varieties[0].id;
        });

        allCategories();
        allProducts();

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

    let filterProducts = products.filter((product) => {
        const searchMatch = product.name.toLowerCase().includes(searchValue);
        const categoryMatch = products.category === categoryValue
        return searchMatch && categoryMatch
    })

    const sortValue = sortOptions.value;
    filterProducts.sort((a, b) => {
        const aVarietyId = selectedVarieties[a.id];
        const bVarietyId = selectedVarieties[b.id];
        const aVariety = a.varieties.find(variety => variety.id === aVarietyId);
        const bVariety = b.varieties.find(variety => variety.id === bVarietyId);

        let comparison = aVariety - bVariety;

        if (sortValue === 'high-to-low') {
            comparison = bVariety - aVariety;
        }

        return comparison;
    });

    if (filterProducts.length === '') {
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




}

loadProducts();


