const productsGrid = document.getElementById('productsGrid');

const products = [];
const cart = [];
const selectedVarieties = [];

const API_URL = "http://localhost/products.php"

const loadProducts = async () => {
    try {
        const res = await fetch(API_URL);
        const data = res.json();
        console.log(data)

        products = data;

        products.forEach((product) => {
            selectedVarieties[product.id] = product.varieties[0].id
        })


    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<div class="error">Failed to load products. Please try again later.</div>';
    }
}



