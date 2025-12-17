<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Original - Discord Members Boosting</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            min-height: 100vh;
        }

        .header {
            background: #2a2a3e;
            padding: 15px 20px;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header h1 {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(45deg, #ff6b35, #ff8c42, #ffa600);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .login-btn {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: #5865F2;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .hero {
            text-align: center;
            padding: 60px 20px;
        }

        .hero h2 {
            font-size: 42px;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #ff6b35, #ffa600);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero p {
            font-size: 18px;
            color: #ccc;
            margin-bottom: 30px;
        }

        .view-products-btn {
            background: white;
            color: #1a1a2e;
            padding: 15px 40px;
            border: none;
            border-radius: 12px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .view-products-btn:hover {
            transform: scale(1.05);
        }

        .customers {
            text-align: center;
            margin: 40px 0;
            font-size: 24px;
        }

        .reviews-section {
            overflow: hidden;
            padding: 40px 0;
            background: rgba(0,0,0,0.2);
        }

        .reviews-container {
            display: flex;
            animation: scroll 20s linear infinite;
            gap: 20px;
        }

        .review-card {
            min-width: 300px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .review-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }

        .review-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff6b35, #ffa600);
        }

        .review-name {
            font-weight: 600;
        }

        .review-stars {
            color: #ffa600;
            font-size: 18px;
        }

        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        .products-section {
            display: none;
            padding: 40px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .products-section.active {
            display: block;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }

        .product-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 30px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s;
            cursor: pointer;
        }

        .product-card:hover {
            transform: translateY(-5px);
            border-color: #ff6b35;
        }

        .product-card.expanded {
            grid-column: 1 / -1;
            transform: scale(1.02);
        }

        .product-preview {
            width: 100%;
            height: 200px;
            background: rgba(0,0,0,0.3);
            border-radius: 12px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #888;
        }

        .product-price {
            font-size: 36px;
            font-weight: 700;
            color: #ffa600;
            margin-bottom: 15px;
        }

        .product-title {
            font-size: 20px;
            margin-bottom: 20px;
        }

        .product-actions {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-add {
            background: white;
            color: #1a1a2e;
            flex: 1;
        }

        .btn-remove {
            background: #dc3545;
            color: white;
            flex: 1;
        }

        .btn:hover {
            transform: scale(1.05);
        }

        .quantity {
            background: rgba(0,0,0,0.3);
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
        }

        .back-btn {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            margin-bottom: 20px;
        }

        .back-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .hero-section {
            display: block;
        }

        .hero-section.hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>ORIGINAL</h1>
        <a href="#" class="login-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Login
        </a>
    </div>

    <div class="hero-section" id="heroSection">
        <div class="hero">
            <h2>The #1 Members Boosting Service</h2>
            <p>Get your server boosted by high quality members with cheapest prices</p>
            <button class="view-products-btn" onclick="showProducts()">View Products</button>
        </div>

        <div class="customers">
            <strong>+10,000</strong> Happy Customers
        </div>

        <div class="reviews-section">
            <div class="reviews-container" id="reviewsContainer"></div>
        </div>
    </div>

    <div class="products-section" id="productsSection">
        <button class="back-btn" onclick="showHero()">← Back</button>
        <h2 style="text-align: center; font-size: 36px; margin-bottom: 20px;">HOT PRODUCTS</h2>
        <div class="products-grid" id="productsGrid"></div>
    </div>

    <script>
        // Generate reviews
        const reviewNames = [
            'Ahmed', 'Sara', 'Mohammed', 'Layla', 'Omar', 'Fatima', 'Ali', 'Noor',
            'Khaled', 'Hiba', 'Youssef', 'Amira', 'Hassan', 'Maryam', 'Zaid'
        ];

        const reviewTexts = [
            'Excellent service! Very fast delivery',
            'Best prices I found online',
            'High quality members, highly recommended',
            'Amazing support team',
            'Got exactly what I ordered',
            'Will definitely buy again'
        ];

        function generateReviews() {
            const container = document.getElementById('reviewsContainer');
            const reviews = [];
            
            for (let i = 0; i < 30; i++) {
                const review = `
                    <div class="review-card">
                        <div class="review-header">
                            <div class="review-avatar"></div>
                            <div>
                                <div class="review-name">${reviewNames[Math.floor(Math.random() * reviewNames.length)]}</div>
                                <div class="review-stars">★★★★★</div>
                            </div>
                        </div>
                        <p>${reviewTexts[Math.floor(Math.random() * reviewTexts.length)]}</p>
                    </div>
                `;
                reviews.push(review);
            }
            
            container.innerHTML = reviews.join('') + reviews.join('');
        }

        // Generate products
        const productTypes = [
            { count: 100, type: 'Auto' },
            { count: 50, type: 'Auto' },
            { count: 100, type: 'Online' },
            { count: 50, type: 'Online' },
            { count: 200, type: 'Auto' },
            { count: 150, type: 'Online' },
            { count: 500, type: 'Auto' },
            { count: 300, type: 'Online' },
            { count: 75, type: 'Auto' },
            { count: 250, type: 'Online' },
            { count: 400, type: 'Auto' },
            { count: 600, type: 'Online' },
            { count: 1000, type: 'Auto' },
            { count: 800, type: 'Online' },
            { count: 120, type: 'Auto' }
        ];

        let productsData = [];

        function generateProducts() {
            const grid = document.getElementById('productsGrid');
            productsData = productTypes.map((prod, index) => ({
                id: index,
                count: prod.count,
                type: prod.type,
                price: (prod.count * 0.05 * (prod.type === 'Online' ? 1.2 : 1)).toFixed(2),
                quantity: 0
            }));

            grid.innerHTML = productsData.map(product => `
                <div class="product-card" id="product-${product.id}" onclick="toggleExpand(${product.id})">
                    <div class="product-preview">Discord Screenshot Preview</div>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-title">${product.count} Members ${product.type}</div>
                    <div class="product-actions">
                        <button class="btn btn-remove" onclick="event.stopPropagation(); removeProduct(${product.id})">Remove</button>
                        <div class="quantity" id="quantity-${product.id}">0</div>
                        <button class="btn btn-add" onclick="event.stopPropagation(); addProduct(${product.id})">Add</button>
                    </div>
                </div>
            `).join('');
        }

        function toggleExpand(id) {
            const card = document.getElementById(`product-${id}`);
            card.classList.toggle('expanded');
        }

        function addProduct(id) {
            productsData[id].quantity++;
            document.getElementById(`quantity-${id}`).textContent = productsData[id].quantity;
        }

        function removeProduct(id) {
            if (productsData[id].quantity > 0) {
                productsData[id].quantity--;
                document.getElementById(`quantity-${id}`).textContent = productsData[id].quantity;
            }
        }

        function showProducts() {
            document.getElementById('heroSection').classList.add('hidden');
            document.getElementById('productsSection').classList.add('active');
        }

        function showHero() {
            document.getElementById('heroSection').classList.remove('hidden');
            document.getElementById('productsSection').classList.remove('active');
        }

        // Initialize
        generateReviews();
        generateProducts();
    </script>
</body>
</html>
