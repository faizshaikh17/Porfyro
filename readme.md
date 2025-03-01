# ShopHere

A responsive e-commerce web application built with HTML, CSS, and JavaScript.

## Overview

This project implements a responsive online store that fetches product data from a PHP API and allows users to browse, search, filter, and handle checkout the products with multiple varieties.

## Features

- **Product Browsing**: View products across multiple categories
- **Product Varieties**: Select from multiple varieties with different prices
- **Filtering & Sorting**:
  - Filter products by category
  - Search products by name
  - Sort products by price (Low to High, High to Low)
- **Shopping Cart**:
  - Add products to cart
  - View cart with total price calculations
  - Persist cart data using Local Storage
  - Adjust item quantities in the cart
- **Checkout**: Process orders with a checkout button

## Technical Details

### API Integration

The application fetches product data from a PHP API that provides product information with multiple varieties:

```json
[
  {
    "id": 1,
    "name": "Coffee",
    "category": "Beverages",
    "image_url": "https://via.placeholder.com/150",
    "varieties": [
      {
        "id": 101,
        "name": "Small",
        "price": 50
      },
      {
        "id": 102,
        "name": "Medium",
        "price": 100
      },
      {
        "id": 103,
        "name": "Large",
        "price": 150
      }
    ]
  }
]
```

### Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **API Communication**: Fetch API
- **Data Persistence**: Local Storage

## Getting Started

1. Clone the repository
2. Set up your PHP server to serve the API
3. Open `index.html` in your browser