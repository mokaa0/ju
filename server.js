<!DOCTYPE html>

<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Original - Members Boosting Service</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%);
        color: white;
        min-height: 100vh;
    }

    .header {
        background: rgba(0, 0, 0, 0.3);
        padding: 20px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo {
        font-size: 32px;
        font-weight: bold;
        color: #ff8c00;
    }

    .login-btn {
        background: rgba(255, 140, 0, 0.2);
        border: 2px solid #ff8c00;
        color: white;
        padding: 10px 25px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        transition: all 0.3s;
    }

    .login-btn:hover {
        background: rgba(255, 140, 0, 0.4);
    }

    .hero {
        text-align: center;
        padding: 80px 20px;
    }

    .hero h1 {
        font-size: 48px;
        margin-bottom: 20px;
        color: #ff8c00;
    }

    .hero p {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 30px;
    }

    .discord-support {
        color: #ff8c00;
        font-size: 18px;
        margin-bottom: 30px;
    }

    .view-products-btn {
        background: white;
        color: #1a0f2e;
        border: none;
        padding: 18px 50px;
        font-size: 18px;
        font-weight: bold;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .view-products-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(255, 140, 0, 0.3);
    }

    .customers {
        text-align: center;
        margin: 50px 0;
        font-size: 24px;
    }

    .reviews-container {
        overflow: hidden;
        padding: 30px 0;
        position: relative;
    }

    .reviews-track {
        display: flex;
        gap: 20px;
        animation: scrollReviews 20s linear infinite;
    }

    .review-card {
        background: rgba(0, 0, 0, 0.5);
        padding: 30px;
        border-radius: 15px;
        min-width: 300px;
        flex-shrink: 0;
    }

    .review-user {
        font-size: 18px;
        margin-bottom: 10px;
        color: #ff8c00;
    }

    .review-text {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
    }

    .stars {
        color: #ff8c00;
        font-size: 20px;
        margin-top: 10px;
    }

    @keyframes scrollReviews {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }

    .products-page {
        display: none;
        padding: 40px 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .products-page.active {
        display: block;
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 30px;
    }

    .product-card {
        background: rgba(0, 0, 0, 0.4);
        border: 2px solid rgba(255, 140, 0, 0.3);
        border-radius: 15px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .product-card:hover {
        transform: translateY(-5px);
        border-color: #ff8c00;
        box-shadow: 0 10px 30px rgba(255, 140, 0, 0.2);
    }

    .product-image {
        width: 100%;
        height: 200px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .product-price {
        font-size: 36px;
        color: #ff8c00;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .product-title {
        font-size: 18px;
        margin-bottom: 20px;
        min-height: 50px;
    }

    .product-controls {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
    }

    .btn {
        padding: 12px 25px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: all 0.3s;
    }

    .add-btn {
        background: white;
        color: #1a0f2e;
    }

    .remove-btn {
        background: #dc3545;
        color: white;
    }

    .quantity {
        background: rgba(0, 0, 0, 0.5);
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 18px;
    }

    .btn:hover {
        transform: scale(1.05);
    }

    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }

    .modal.active {
        display: flex;
    }

    .modal-content {
        background: linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 100%);
        border: 2px solid #ff8c00;
        border-radius: 20px;
        padding: 40px;
        max-width: 600px;
        width: 100%;
        position: relative;
    }

    .close-modal {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
    }

    .back-btn {
        background: rgba(255, 140, 0, 0.2);
        border: 2px solid #ff8c00;
        color: white;
        padding: 10px 25px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        margin-bottom: 20px;
        transition: all 0.3s;
    }

    .back-btn:hover {
        background: rgba(255, 140, 0, 0.4);
    }

    @media (max-width: 768px) {
        .hero h1 {
            font-size: 32px;
        }
        
        .product-grid {
            grid-template-columns: 1fr;
        }
    }
</style>

</head>
<body>
    <!-- الصفحة الرئيسية -->
    <div id="homePage">
        <div class="header">
            <div class="logo">ORIGINAL</div>
            <button class="login-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Login
            </button>
        </div>

    <div class="hero">
        <h1>The #1 Members Boosting Service</h1>
        <p>Get your server boosted by high quality members with cheapest prices</p>
        <div class="discord-support">Discord Support</div>
        <button class="view-products-btn" onclick="showProducts()">View Products</button>
    </div>

    <div class="customers">+10,000 Happy Customers</div>

    <div class="reviews-container">
        <div class="reviews-track">
            <div class="review-card">
                <div class="review-user">@ttvst</div>
                <div class="review-text">very good</div>
                <div class="stars">★★★★★</div>
            </div>
            <div class="review-card">
                <div class="review-user">@user123</div>
                <div class="review-text">excellent service!</div>
                <div class="stars">★★★★★</div>
            </div>
            <div class="review-card">
                <div class="review-user">@gamer99</div>
                <div class="review-text">fast delivery</div>
                <div class="stars">★★★★★</div>
            </div>
            <div class="review-card">
                <div class="review-user">@discord_pro</div>
                <div class="review-text">highly recommended</div>
                <div class="stars">★★★★★</div>
            </div>
            <!-- نسخ للتكرار -->
            <div class="review-card">
                <div class="review-user">@ttvst</div>
                <div class="review-text">very good</div>
                <div class="stars">★★★★★</div>
            </div>
            <div class="review-card">
                <div class="review-user">@user123</div>
                <div class="review-text">excellent service!</div>
                <div class="stars">★★★★★</div>
            </div>
            <div class="review-card">
                <div class="review-user">@gamer99</div>
                <div class="review-text">fast delivery</div>
                <div class="stars">★★★★★</div>
            </div>
            <div class="review-card">
                <div class="review-user">@discord_pro</div>
                <div class="review-text">highly recommended</div>
                <div class="stars">★★★★★</div>
            </div>
        </div>
    </div>
</div>

<!-- صفحة المنتجات -->
<div id="productsPage" class="products-page">
    <div class="header">
        <div class="logo">ORIGINAL</div>
        <button class="login-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Login
        </button>
    </div>

    <button class="back-btn" onclick="showHome()">← العودة للرئيسية</button>

    <div class="product-grid" id="productGrid"></div>
</div>

<!-- نافذة تكبير المنتج -->
<div id="modal" class="modal">
    <div class="modal-content">
        <button class="close-modal" onclick="closeModal()">×</button>
        <div id="modalContent"></div>
    </div>
</div>

<script>
    const products = [
        { id: 1, price: '$1.99', title: '250 Members Discord Online' },
        { id: 2, price: '$0.79', title: '100 Members Discord Online' },
        { id: 3, price: '$0.99', title: '50 auto members (280 Max for each server)' },
        { id: 4, price: '$4.99', title: '1000 Members Offline With 250 Members Online' },
        { id: 5, price: '$5.49', title: '280 autoreaction members (280 Max for each server)' },
        { id: 6, price: '$2.49', title: '150 auto members (280 Max for each server)' },
        { id: 7, price: '$2.99', title: '50 Chat Members (NO ACCEPT PAYPAL)' },
        { id: 8, price: '$5.99', title: '100 Chat Members (NO ACCEPT PAYPAL)' }
    ];

    const cart = {};

    function showProducts() {
        document.getElementById('homePage').style.display = 'none';
        document.getElementById('productsPage').classList.add('active');
        renderProducts();
    }

    function showHome() {
        document.getElementById('homePage').style.display = 'block';
        document.getElementById('productsPage').classList.remove('active');
    }

    function renderProducts() {
        const grid = document.getElementById('productGrid');
        grid.innerHTML = products.map(product => `
            <div class="product-card" onclick="openModal(${product.id})">
                <div class="product-image">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="#ff8c00">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                </div>
                <div class="product-price">${product.price}</div>
                <div class="product-title">${product.title}</div>
                <div class="product-controls">
                    <button class="btn remove-btn" onclick="removeItem(event, ${product.id})">Remove</button>
                    <div class="quantity">${cart[product.id] || 0}</div>
                    <button class="btn add-btn" onclick="addItem(event, ${product.id})">Add</button>
                </div>
            </div>
        `).join('');
    }

    function addItem(event, id) {
        event.stopPropagation();
        cart[id] = (cart[id] || 0) + 1;
        renderProducts();
    }

    function removeItem(event, id) {
        event.stopPropagation();
        if (cart[id] && cart[id] > 0) {
            cart[id]--;
        }
        renderProducts();
    }

    function openModal(id) {
        const product = products.find(p => p.id === id);
        const modal = document.getElementById('modal');
        const content = document.getElementById('modalContent');
        
        content.innerHTML = `
            <div class="product-image" style="height: 300px;">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="#ff8c00">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
            </div>
            <div class="product-price" style="margin-top: 20px;">${product.price}</div>
            <div class="product-title" style="font-size: 22px; margin: 20px 0;">${product.title}</div>
            <div class="product-controls">
                <button class="btn remove-btn" onclick="removeItem(event, ${product.id}); updateModal(${product.id})">Remove</button>
                <div class="quantity">${cart[product.id] || 0}</div>
                <button class="btn add-btn" onclick="addItem(event, ${product.id}); updateModal(${product.id})">Add</button>
            </div>
        `;
        
        modal.classList.add('active');
    }

    function updateModal(id) {
        const product = products.find(p => p.id === id);
        openModal(id);
    }

    function closeModal() {
        document.getElementById('modal').classList.remove('active');
    }

    // إغلاق النافذة عند الضغط خارجها
    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
</script>

</body>
</html>