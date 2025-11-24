class DiscordAccountManager {
    constructor() {
        this.accounts = [];
        this.init();
    }

    async init() {
        await this.loadTokens();
        await this.validateAllAccounts();
        this.displayAccounts();
    }

    async loadTokens() {
        try {
            const response = await fetch('tokens.txt');
            if (!response.ok) {
                throw new Error('لم يتم العثور على ملف tokens.txt');
            }
            
            const text = await response.text();
            this.accounts = text.split('\n')
                .map(line => line.trim())
                .filter(line => line && line.length > 50) // تأكد أن التوكن طويل بما يكفي
                .map(token => ({
                    token: token,
                    id: Math.random().toString(36).substr(2, 9),
                    isValid: false,
                    isLoading: true,
                    data: null,
                    error: null
                }));
            
        } catch (error) {
            this.showError(`خطأ في تحميل التوكنات: ${error.message}`);
        }
    }

    async validateAllAccounts() {
        const promises = this.accounts.map(account => this.validateAccount(account));
        await Promise.all(promises);
        document.getElementById('loading').style.display = 'none';
    }

    async validateAccount(account) {
        try {
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    'Authorization': account.token
                }
            });

            if (response.ok) {
                const userData = await response.json();
                account.data = userData;
                account.isValid = true;
                account.isLoading = false;
                
                // جلب معلومات إضافية
                await this.fetchAdditionalData(account);
            } else {
                throw new Error(`خطأ: ${response.status}`);
            }
        } catch (error) {
            account.error = error.message;
            account.isValid = false;
            account.isLoading = false;
        }
    }

    async fetchAdditionalData(account) {
        try {
            // جلب معلومات الخادم
            const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
                headers: {
                    'Authorization': account.token
                }
            });
            
            if (guildsResponse.ok) {
                account.data.guilds = await guildsResponse.json();
            }

            // جلب معلومات الأصدقاء
            const friendsResponse = await fetch('https://discord.com/api/v10/users/@me/relationships', {
                headers: {
                    'Authorization': account.token
                }
            });
            
            if (friendsResponse.ok) {
                account.data.friends = await friendsResponse.json();
            }

        } catch (error) {
            console.log('خطأ في جلب المعلومات الإضافية:', error);
        }
    }

    displayAccounts() {
        const grid = document.getElementById('accountsGrid');
        const totalEl = document.getElementById('totalAccounts');
        const validEl = document.getElementById('validAccounts');
        const onlineEl = document.getElementById('onlineAccounts');
        
        totalEl.textContent = `إجمالي الحسابات: ${this.accounts.length}`;
        const validCount = this.accounts.filter(acc => acc.isValid).length;
        validEl.textContent = `الحسابات الصالحة: ${validCount}`;
        onlineEl.textContent = `الحسابات النشطة: ${validCount}`;

        grid.innerHTML = this.accounts.map(account => this.createAccountCard(account)).join('');
    }

    createAccountCard(account) {
        if (account.isLoading) {
            return `
                <div class="account-card">
                    <div class="account-header">
                        <div class="avatar" style="background: #ccc;"></div>
                        <div class="user-info">
                            <h3>جاري التحميل...</h3>
                            <div class="user-details">جاري التحقق من التوكن</div>
                        </div>
                    </div>
                </div>
            `;
        }

        if (!account.isValid) {
            return `
                <div class="account-card">
                    <div class="account-header">
                        <div class="avatar" style="background: #ff6b6b;"></div>
                        <div class="user-info">
                            <h3 style="color: #ff6b6b;">توكن غير صالح</h3>
                            <div class="user-details">${account.error}</div>
                            <div class="token-preview">${account.token.substring(0, 25)}...</div>
                        </div>
                    </div>
                </div>
            `;
        }

        const user = account.data;
        const avatarUrl = user.avatar ? 
            `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` :
            `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;

        return `
            <div class="account-card">
                <div class="account-header">
                    <img src="${avatarUrl}" alt="Avatar" class="avatar" 
                         onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    <div class="user-info">
                        <h3>${user.username}<span class="badge badge-verified">#${user.discriminator}</span></h3>
                        <div class="user-details">
                            <strong>ID:</strong> ${user.id}<br>
                            <strong>البريد:</strong> ${user.email || 'غير متوفر'}<br>
                            <strong>الخوادم:</strong> ${account.data.guilds ? account.data.guilds.length : 'غير معروف'}<br>
                            <strong>الأصدقاء:</strong> ${account.data.friends ? account.data.friends.length : 'غير معروف'}<br>
                            <strong>أنشئ في:</strong> ${new Date(user.created_at).toLocaleDateString('ar-EG')}
                        </div>
                        <div class="token-preview">${account.token.substring(0, 20)}...</div>
                    </div>
                </div>
                
                <div class="controls">
                    <div class="control-group">
                        <label>اسم المستخدم الجديد:</label>
                        <input type="text" id="username-${account.id}" placeholder="${user.username}">
                    </div>
                    
                    <div class="control-group">
                        <label>البايو (الوصف):</label>
                        <textarea id="bio-${account.id}" placeholder="أدخل البايو الجديد..." rows="2"></textarea>
                    </div>
                    
                    <button class="btn btn-primary" onclick="accountManager.updateProfile('${account.id}')">
                        ✏️ تحديث الملف الشخصي
                    </button>
                    
                    <button class="btn btn-success" onclick="accountManager.refreshAccount('${account.id}')">
                        🔄 تحديث المعلومات
                    </button>
                    
                    <button class="btn btn-danger" onclick="accountManager.logoutAccount('${account.id}')">
                        🚪 تسجيل الخروج
                    </button>
                </div>
            </div>
        `;
    }

    async updateProfile(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account || !account.isValid) return;

        const newUsername = document.getElementById(`username-${accountId}`).value;
        const newBio = document.getElementById(`bio-${accountId}`).value;

        try {
            const updates = {};
            if (newUsername) updates.username = newUsername;
            if (newBio) updates.bio = newBio;

            const response = await fetch('https://discord.com/api/v10/users/@me', {
                method: 'PATCH',
                headers: {
                    'Authorization': account.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                this.showSuccess('✅ تم تحديث الملف الشخصي بنجاح');
                await this.validateAccount(account); // إعادة تحميل البيانات
                this.displayAccounts();
            } else {
                throw new Error(`فشل التحديث: ${response.status}`);
            }
        } catch (error) {
            this.showError(`خطأ في تحديث الملف: ${error.message}`);
        }
    }

    async refreshAccount(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account) return;

        account.isLoading = true;
        this.displayAccounts();

        await this.validateAccount(account);
        this.displayAccounts();
        this.showSuccess('✅ تم تحديث معلومات الحساب');
    }

    async logoutAccount(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account || !account.isValid) return;

        try {
            const response = await fetch('https://discord.com/api/v10/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': account.token
                }
            });

            if (response.ok) {
                this.showSuccess('✅ تم تسجيل الخروج بنجاح');
                account.isValid = false;
                this.displayAccounts();
            } else {
                throw new Error(`فشل تسجيل الخروج: ${response.status}`);
            }
        } catch (error) {
            this.showError(`خطأ في تسجيل الخروج: ${error.message}`);
        }
    }

    showError(message) {
        const errorEl = document.getElementById('error');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        setTimeout(() => errorEl.style.display = 'none', 5000);
    }

    showSuccess(message) {
        const successEl = document.getElementById('success');
        successEl.textContent = message;
        successEl.style.display = 'block';
        setTimeout(() => successEl.style.display = 'none', 5000);
    }
}

// بدء التطبيق
const accountManager = new DiscordAccountManager();